import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminPortalPage from './AdminPortalPage';

const mocks = vi.hoisted(() => ({
  getPendingServicesMock: vi.fn(),
  validateServiceMock: vi.fn(),
  denyServiceMock: vi.fn(),
  state: {
    authenticatedUser: {
      role: 'ADMIN' as 'ADMIN' | 'CUSTOMER' | 'SERVICE_PROVIDER',
      token: 'admin-token',
    } as
      | { role: 'ADMIN' | 'CUSTOMER' | 'SERVICE_PROVIDER'; token: string }
      | undefined,
  },
}));

vi.mock('../../api', () => ({
  serviceApi: {
    getPendingServices: mocks.getPendingServicesMock,
    validateService: mocks.validateServiceMock,
    denyService: mocks.denyServiceMock,
  },
}));

vi.mock('../../contexts/useAuthContext', () => ({
  useAuthContext: () => ({ authenticatedUser: mocks.state.authenticatedUser }),
}));

describe('AdminPortalPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.state.authenticatedUser = { role: 'ADMIN', token: 'admin-token' };
    mocks.getPendingServicesMock.mockResolvedValue([
      {
        id: 3,
        serviceTitle: 'Audit SEO',
        price: 110,
        status: 'PENDING',
        author: { email: 'provider@test.com' },
      },
    ]);
  });

  it('shows access restriction for non admin users', () => {
    mocks.state.authenticatedUser = {
      role: 'CUSTOMER',
      token: 'customer-token',
    };

    render(
      <MemoryRouter>
        <AdminPortalPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Acces reserve admin')).toBeTruthy();
  });

  it('validates a pending service', async () => {
    render(
      <MemoryRouter>
        <AdminPortalPage />
      </MemoryRouter>,
    );

    await screen.findByText('Audit SEO');
    fireEvent.click(screen.getByRole('button', { name: 'Valider' }));

    await waitFor(() => {
      expect(mocks.validateServiceMock).toHaveBeenCalledWith(3, 'admin-token');
      expect(screen.queryByText('Audit SEO')).toBeNull();
    });
  });
});
