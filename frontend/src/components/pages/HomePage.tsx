import { useEffect, useState } from 'react';
import { serviceApi } from '../../api';
import { ServiceDto } from '../../types';
import { useCartContext } from '../../contexts/useCartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const HomePage = () => {
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { lines, addLine } = useCartContext();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const validatedServices = await serviceApi.getValidatedServices();
        setServices(validatedServices);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Impossible de recuperer les services.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Services disponibles
        </h1>
        <p className="text-sm text-muted-foreground">
          Choisis un service puis clique sur reserver pour l&apos;ajouter au
          panier.
        </p>
      </header>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-5 w-2/3 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-1/2 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {error ? (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive">
              Erreur de chargement
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">{error}</CardContent>
        </Card>
      ) : null}

      {!isLoading && !error ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const isInCart = lines.some(
              (line) => line.serviceId === service.id,
            );

            return (
              <Card
                key={service.id}
                className="border-border/70 backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg">
                      {service.serviceTitle}
                    </CardTitle>
                    <Badge variant="secondary">{service.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Service #{service.id}
                  </p>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-3">
                  <p className="text-xl font-semibold">
                    {service.price.toFixed(2)} EUR
                  </p>
                  <Button
                    onClick={() => addLine(service)}
                    disabled={isInCart}
                    variant={isInCart ? 'secondary' : 'default'}
                  >
                    {isInCart ? 'Ajoute' : 'Reserver'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : null}
    </section>
  );
};

export default HomePage;
