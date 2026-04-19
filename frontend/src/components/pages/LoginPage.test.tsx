import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import LoginPage from './LoginPage';

const navigateMock = vi.fn();
const loginUserMock = vi.fn();

vi.mock('../../contexts/useAuthContext', () => ({
  useAuthContext: () => ({
    loginUser: loginUserMock,
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

describe('LoginPage', () => {
  it('logs in and redirects to home', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'john@doe.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByRole('button', { name: "S'authentifier" }));

    await waitFor(() => {
      expect(loginUserMock).toHaveBeenCalledWith({
        email: 'john@doe.com',
        password: 'secret123',
      });
      expect(navigateMock).toHaveBeenCalledWith('/');
    });
  });
});
