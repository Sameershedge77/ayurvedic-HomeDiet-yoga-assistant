import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import AppRoutes from './AppRoutes';

// Mock all pages to isolate routing logic
vi.mock('../pages/LandingPage', () => ({ default: () => <div data-testid="landing-page">Landing</div> }));
vi.mock('../pages/LoginPage', () => ({ default: () => <div data-testid="login-page">Login</div> }));
vi.mock('../pages/Registerpage', () => ({ default: () => <div data-testid="register-page">Register</div> }));

describe('AppRoutes Integration', () => {
  const renderWithRoute = (route) => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <AppRoutes />
      </MemoryRouter>
    );
  };

  it('renders LandingPage on default route', () => {
    renderWithRoute('/');
    expect(screen.getByTestId('landing-page')).toBeInTheDocument();
  });

  it('renders LoginPage on /login route', () => {
    renderWithRoute('/login');
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('renders RegisterPage on /register route', () => {
    renderWithRoute('/register');
    expect(screen.getByTestId('register-page')).toBeInTheDocument();
  });
});
