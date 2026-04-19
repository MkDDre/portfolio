import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import HomePage from './HomePage';

const mocks = vi.hoisted(() => ({
  getValidatedServicesMock: vi.fn(),
  addLineMock: vi.fn(),
  state: {
    cartLines: [] as Array<{ serviceId: number }>,
  },
}));

vi.mock('../../api', () => ({
  serviceApi: {
    getValidatedServices: mocks.getValidatedServicesMock,
  },
}));

vi.mock('../../contexts/useCartContext', () => ({
  useCartContext: () => ({
    lines: mocks.state.cartLines,
    addLine: mocks.addLineMock,
  }),
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.state.cartLines = [];
  });

  it('loads and displays validated services', async () => {
    mocks.getValidatedServicesMock.mockResolvedValueOnce([
      {
        id: 1,
        serviceTitle: 'Coaching React',
        price: 99,
        status: 'VALIDATED',
      },
    ]);

    render(<HomePage />);

    expect(await screen.findByText('Coaching React')).toBeTruthy();
    expect(screen.getByText('99.00 EUR')).toBeTruthy();
  });

  it('adds service to cart when clicking reserver', async () => {
    mocks.getValidatedServicesMock.mockResolvedValueOnce([
      {
        id: 2,
        serviceTitle: 'Audit UX',
        price: 120,
        status: 'VALIDATED',
      },
    ]);

    render(<HomePage />);

    const reserveButton = await screen.findByRole('button', {
      name: 'Reserver',
    });
    fireEvent.click(reserveButton);

    expect(mocks.addLineMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: 2, serviceTitle: 'Audit UX' }),
    );
  });

  it('shows fetch error when API fails', async () => {
    mocks.getValidatedServicesMock.mockRejectedValueOnce(new Error('boom'));

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('Erreur de chargement')).toBeTruthy();
      expect(screen.getByText('boom')).toBeTruthy();
    });
  });
});
