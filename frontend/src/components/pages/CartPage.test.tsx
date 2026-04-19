import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CartPage from './CartPage';

const mocks = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  createReservationMock: vi.fn(),
  clearCartMock: vi.fn(),
  removeLineMock: vi.fn(),
  state: {
    authUser: undefined as { token: string } | undefined,
    cartLines: [
      { serviceId: 1, serviceTitle: 'Coaching', price: 90 },
      { serviceId: 2, serviceTitle: 'Mentorat', price: 60 },
    ],
    totalPrice: 150,
  },
}));

vi.mock('../../api', () => ({
  reservationApi: {
    createReservation: mocks.createReservationMock,
  },
}));

vi.mock('../../contexts/useAuthContext', () => ({
  useAuthContext: () => ({
    authenticatedUser: mocks.state.authUser,
  }),
}));

vi.mock('../../contexts/useCartContext', () => ({
  useCartContext: () => ({
    lines: mocks.state.cartLines,
    totalPrice: mocks.state.totalPrice,
    removeLine: mocks.removeLineMock,
    clearCart: mocks.clearCartMock,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  );
  return {
    ...actual,
    useNavigate: () => mocks.navigateMock,
  };
});

describe('CartPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.state.authUser = { token: 'token-123' };
    mocks.state.cartLines = [
      { serviceId: 1, serviceTitle: 'Coaching', price: 90 },
      { serviceId: 2, serviceTitle: 'Mentorat', price: 60 },
    ];
    mocks.state.totalPrice = 150;
  });

  it('redirects to login when submitting unauthenticated', () => {
    mocks.state.authUser = undefined;

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Confirmer' }));

    expect(mocks.navigateMock).toHaveBeenCalledWith('/login');
  });

  it('shows empty cart error if no lines', () => {
    mocks.state.cartLines = [];
    mocks.state.totalPrice = 0;

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Confirmer' }));

    expect(screen.getByText('Le panier est vide.')).toBeTruthy();
  });

  it('creates reservation and clears cart', async () => {
    mocks.createReservationMock.mockResolvedValueOnce({
      id: 77,
      reservationDate: '2026-08-01T10:00:00',
      total_price: 150,
      status: 'FUTUR',
    });

    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Confirmer' }));

    await waitFor(() => {
      expect(mocks.createReservationMock).toHaveBeenCalled();
      expect(mocks.clearCartMock).toHaveBeenCalled();
      expect(
        screen.getByText('Reservation creee #77 (FUTUR)'),
      ).toBeTruthy();
    });
  });
});
