import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { reservationApi } from '../../api';
import { useAuthContext } from '../../contexts/useAuthContext';
import { ReservationDto } from '../../types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const getStatusVariant = (status: ReservationDto['status']) => {
  if (status === 'CANCELED') {
    return 'destructive';
  }
  if (status === 'PAST') {
    return 'secondary';
  }
  return 'default';
};

const formatDate = (dateAsString: string) =>
  new Date(dateAsString).toLocaleString('fr-BE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

const MyReservationsPage = () => {
  const { authenticatedUser, isAuthenticated } = useAuthContext();
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authenticatedUser) {
      return;
    }

    const fetchReservations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const myReservations = await reservationApi.getMyReservations(
          authenticatedUser.token,
        );
        setReservations(myReservations);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Impossible de recuperer les reservations.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [authenticatedUser]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-6 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Mes reservations
        </h1>
        <p className="text-sm text-muted-foreground">
          Retrouve toutes tes reservations, de la plus recente a la plus
          ancienne.
        </p>
      </header>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-5 w-1/2 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-2/3 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {error ? (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive">Erreur</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">{error}</CardContent>
        </Card>
      ) : null}

      {!isLoading && !error && reservations.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            Aucune reservation pour le moment.
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !error && reservations.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {reservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-lg">
                    Reservation #{reservation.id}
                  </CardTitle>
                  <Badge variant={getStatusVariant(reservation.status)}>
                    {reservation.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Date: </span>
                  <span>{formatDate(reservation.reservationDate)}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Total: </span>
                  <span className="font-semibold">
                    {reservation.total_price.toFixed(2)} EUR
                  </span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default MyReservationsPage;
