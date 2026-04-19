import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MyReservationsPage from './MyReservationsPage';

const mocks = vi.hoisted(() => ({
  getMyReservationsMock: vi.fn(),
  state: {
    authState: {
      isAuthenticated: true,
      authenticatedUser: { token: 'token-abc' } as
        | { token: string }
        | undefined,
    },
  },
}));

vi.mock('../../api', () => ({
  reservationApi: {
    getMyReservations: mocks.getMyReservationsMock,
  },
}));

vi.mock('../../contexts/useAuthContext', () => ({
  useAuthContext: () => mocks.state.authState,
}));

describe('MyReservationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.state.authState = {
      isAuthenticated: true,
      authenticatedUser: { token: 'token-abc' },
    };
  });

  it('redirects to login when unauthenticated', () => {
    mocks.state.authState = {
      isAuthenticated: false,
      authenticatedUser: undefined,
    };

    render(
      <MemoryRouter initialEntries={['/my-reservations']}>
        <Routes>
          <Route path="/my-reservations" element={<MyReservationsPage />} />
          <Route path="/login" element={<div>Login screen</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login screen')).toBeTruthy();
  });

  it('loads and displays user reservations', async () => {
    mocks.getMyReservationsMock.mockResolvedValueOnce([
      {
        id: 12,
        reservationDate: '2026-07-20T09:00:00',
        total_price: 180,
        status: 'FUTUR',
      },
    ]);

    render(
      <MemoryRouter>
        <MyReservationsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mocks.getMyReservationsMock).toHaveBeenCalledWith('token-abc');
      expect(screen.getByText('Reservation #12')).toBeTruthy();
      expect(screen.getByText('180.00 EUR')).toBeTruthy();
    });
  });
});
