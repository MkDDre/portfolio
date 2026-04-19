import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { serviceApi } from '../../api';
import { useAuthContext } from '../../contexts/useAuthContext';
import { ServiceDto } from '../../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminPortalPage = () => {
  const { authenticatedUser } = useAuthContext();
  const [pendingServices, setPendingServices] = useState<ServiceDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = authenticatedUser?.role === 'ADMIN';

  const refreshPendingServices = async () => {
    if (!authenticatedUser || !isAdmin) return;

    try {
      setIsLoading(true);
      const services = await serviceApi.getPendingServices(authenticatedUser.token);
      setPendingServices(services);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de recuperer les demandes en attente.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshPendingServices();
  }, [authenticatedUser?.token]);

  const handleModeration = async (
    serviceId: number,
    action: 'validate' | 'deny',
  ) => {
    if (!authenticatedUser || !isAdmin) return;

    try {
      setError(null);
      if (action === 'validate') {
        await serviceApi.validateService(serviceId, authenticatedUser.token);
      } else {
        await serviceApi.denyService(serviceId, authenticatedUser.token);
      }

      setPendingServices((current) =>
        current.filter((service) => service.id !== serviceId),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Action de moderation impossible.',
      );
    }
  };

  const stats = useMemo(
    () => ({
      totalPending: pendingServices.length,
    }),
    [pendingServices.length],
  );

  if (!authenticatedUser) {
    return (
      <section className="mx-auto w-full max-w-xl px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Connexion requise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Connecte-toi avec un compte admin pour acceder au portail.</p>
            <Button asChild>
              <Link to="/login">Aller a la connexion</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="mx-auto w-full max-w-xl px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Acces reserve admin</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Ton role actuel est {authenticatedUser.role}. Ce portail est reserve aux
            comptes ADMIN.
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Portail admin</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <Badge variant="secondary">Demandes en attente: {stats.totalPending}</Badge>
          <p className="text-sm text-muted-foreground">
            Validation ou rejet des commandes de publication des services.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commandes a moderer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? <p className="text-sm text-muted-foreground">Chargement...</p> : null}

          {!isLoading && pendingServices.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune commande en attente pour le moment.
            </p>
          ) : null}

          {pendingServices.map((service) => (
            <div
              key={service.id}
              className="flex flex-col gap-3 rounded-lg border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{service.serviceTitle}</p>
                <p className="text-sm text-muted-foreground">
                  {service.price.toFixed(2)} EUR - Auteur: {service.author?.email ?? 'N/A'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleModeration(service.id, 'validate')}
                >
                  Valider
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleModeration(service.id, 'deny')}
                >
                  Rejeter
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

export default AdminPortalPage;