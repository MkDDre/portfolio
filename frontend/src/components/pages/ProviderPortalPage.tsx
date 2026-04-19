import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { serviceApi } from '../../api';
import { useAuthContext } from '../../contexts/useAuthContext';
import { ServiceDto } from '../../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ProviderPortalPage = () => {
  const { authenticatedUser } = useAuthContext();
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [serviceTitle, setServiceTitle] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isProvider = authenticatedUser?.role === 'SERVICE_PROVIDER';

  const refreshMyServices = async () => {
    if (!authenticatedUser || !isProvider) return;

    try {
      setIsLoading(true);
      const myServices = await serviceApi.getMyServices(authenticatedUser.token);
      setServices(myServices);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Impossible de charger tes services.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshMyServices();
  }, [authenticatedUser?.token]);

  const visibleServices = useMemo(
    () => services.slice().sort((a, b) => b.id - a.id),
    [services],
  );

  const handleCreateService = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authenticatedUser || !isProvider) return;

    try {
      setIsSubmitting(true);
      setError(null);

      await serviceApi.createService(
        {
          serviceTitle,
          price: Number(price),
          status: 'PENDING',
        },
        authenticatedUser.token,
      );

      setServiceTitle('');
      setPrice('');
      await refreshMyServices();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Creation du service impossible.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMask = async (serviceId: number) => {
    if (!authenticatedUser || !isProvider) return;

    try {
      setError(null);
      await serviceApi.maskService(serviceId, authenticatedUser.token);
      await refreshMyServices();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Impossible de masquer le service.',
      );
    }
  };

  if (!authenticatedUser) {
    return (
      <section className="mx-auto w-full max-w-xl px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Connexion requise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Connecte-toi avec un compte prestataire pour acceder au portail.</p>
            <Button asChild>
              <Link to="/login">Aller a la connexion</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!isProvider) {
    return (
      <section className="mx-auto w-full max-w-xl px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Acces reserve prestataires</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Ton role actuel est {authenticatedUser.role}. Ce portail est reserve aux
            comptes SERVICE_PROVIDER.
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1.1fr_1.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>Nouveau service</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleCreateService}>
            <div className="grid gap-2">
              <Label htmlFor="serviceTitle">Titre du service</Label>
              <Input
                id="serviceTitle"
                value={serviceTitle}
                onChange={(e) => setServiceTitle(e.currentTarget.value)}
                required
                placeholder="Coaching React"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Prix</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.currentTarget.value)}
                required
                placeholder="79.99"
              />
            </div>

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Soumission...' : 'Soumettre le service'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mes services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? <p className="text-sm text-muted-foreground">Chargement...</p> : null}

          {!isLoading && visibleServices.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucun service pour le moment. Soumets ton premier service.
            </p>
          ) : null}

          {visibleServices.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between rounded-lg border px-4 py-3"
            >
              <div>
                <p className="font-medium">{service.serviceTitle}</p>
                <p className="text-sm text-muted-foreground">
                  {service.price.toFixed(2)} EUR
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="secondary">{service.status}</Badge>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={service.status === 'MASKED'}
                  onClick={() => handleMask(service.id)}
                >
                  Masquer
                </Button>
              </div>
            </div>
          ))}

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </CardContent>
      </Card>
    </section>
  );
};

export default ProviderPortalPage;