import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProviderPortalPage from './ProviderPortalPage';

const mocks = vi.hoisted(() => ({
  getMyServicesMock: vi.fn(),
  createServiceMock: vi.fn(),
  maskServiceMock: vi.fn(),
  state: {
    authenticatedUser: {
      role: 'SERVICE_PROVIDER' as 'SERVICE_PROVIDER' | 'CUSTOMER' | 'ADMIN',
      token: 'provider-token',
    } as { role: 'SERVICE_PROVIDER' | 'CUSTOMER' | 'ADMIN'; token: string } | undefined,
  },
}));

vi.mock('../../api', () => ({
  serviceApi: {
    getMyServices: mocks.getMyServicesMock,
    createService: mocks.createServiceMock,
    maskService: mocks.maskServiceMock,
  },
}));

vi.mock('../../contexts/useAuthContext', () => ({
  useAuthContext: () => ({ authenticatedUser: mocks.state.authenticatedUser }),
}));

describe('ProviderPortalPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.state.authenticatedUser = { role: 'SERVICE_PROVIDER', token: 'provider-token' };
    mocks.getMyServicesMock.mockResolvedValue([]);
  });

  it('shows login gate when unauthenticated', () => {
    mocks.state.authenticatedUser = undefined;

    render(
      <MemoryRouter>
        <ProviderPortalPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Connexion requise')).toBeTruthy();
  });

  it('creates service and refreshes list for provider', async () => {
    mocks.getMyServicesMock.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <ProviderPortalPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('Titre du service'), {
      target: { value: 'Formation TS' },
    });
    fireEvent.change(screen.getByLabelText('Prix'), {
      target: { value: '79.99' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Soumettre le service' }));

    await waitFor(() => {
      expect(mocks.createServiceMock).toHaveBeenCalledWith(
        {
          serviceTitle: 'Formation TS',
          price: 79.99,
          status: 'PENDING',
        },
        'provider-token',
      );
    });
  });
});
