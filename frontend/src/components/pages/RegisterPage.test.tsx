import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RegisterPage from './RegisterPage';

const navigateMock = vi.fn();
const registerUserMock = vi.fn();

vi.mock('../../contexts/useAuthContext', () => ({
  useAuthContext: () => ({
    registerUser: registerUserMock,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  );
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows mismatch password error', async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'john@doe.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'abc12345' },
    });
    fireEvent.change(screen.getByLabelText('Confirmer le password'), {
      target: { value: 'different' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Creer mon compte' }));

    expect(
      screen.getByText('Les mots de passe ne correspondent pas.'),
    ).toBeTruthy();
    expect(registerUserMock).not.toHaveBeenCalled();
  });

  it('registers and redirects to home', async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'john@doe.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'abc12345' },
    });
    fireEvent.change(screen.getByLabelText('Confirmer le password'), {
      target: { value: 'abc12345' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Creer mon compte' }));

    await waitFor(() => {
      expect(registerUserMock).toHaveBeenCalledWith({
        email: 'john@doe.com',
        password: 'abc12345',
      });
      expect(navigateMock).toHaveBeenCalledWith('/');
    });
  });
});
