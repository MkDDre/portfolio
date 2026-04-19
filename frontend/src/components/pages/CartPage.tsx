import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { reservationApi } from '../../api';
import { useAuthContext } from '../../contexts/useAuthContext';
import { useCartContext } from '../../contexts/useCartContext';
import { ReservationDto } from '../../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const getDefaultReservationDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(10, 0, 0, 0);
  return date.toISOString().slice(0, 16);
};

const CartPage = () => {
  const navigate = useNavigate();
  const { authenticatedUser } = useAuthContext();
  const { lines, totalPrice, removeLine, clearCart } = useCartContext();
  const [reservationDate, setReservationDate] = useState(getDefaultReservationDate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<ReservationDto | null>(null);

  const handleSubmitReservation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!authenticatedUser) {
      navigate('/login');
      return;
    }

    if (lines.length === 0) {
      setError('Le panier est vide.');
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);

      const createdReservation = await reservationApi.createReservation(
        {
          reservationDate,
          lines: lines.map((line) => ({
            serviceId: line.serviceId,
            date: reservationDate,
          })),
        },
        authenticatedUser.token,
      );

      setReservation(createdReservation);
      clearCart();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de valider la reservation.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-8 lg:grid-cols-[1.8fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Panier</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {lines.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucun service dans le panier.{' '}
              <Link className="font-medium underline" to="/">
                Retour a l&apos;accueil
              </Link>
            </p>
          ) : (
            lines.map((line) => (
              <div
                key={line.serviceId}
                className="flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <div>
                  <p className="font-medium">{line.serviceTitle}</p>
                  <p className="text-sm text-muted-foreground">Service #{line.serviceId}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold">{line.price.toFixed(2)} EUR</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLine(line.serviceId)}
                  >
                    Retirer
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Valider la reservation</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmitReservation}>
            <label className="block space-y-2 text-sm">
              <span className="text-muted-foreground">Date de reservation</span>
              <Input
                type="datetime-local"
                value={reservationDate}
                onChange={(e) => setReservationDate(e.currentTarget.value)}
                required
              />
            </label>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <strong className="text-lg">{totalPrice.toFixed(2)} EUR</strong>
            </div>

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Validation...' : 'Confirmer'}
            </Button>

            {!authenticatedUser ? (
              <p className="text-xs text-muted-foreground">
                Connecte-toi pour finaliser la reservation.
              </p>
            ) : null}

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            {reservation ? (
              <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800">
                Reservation creee #{reservation.id} ({reservation.status})
              </div>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default CartPage;