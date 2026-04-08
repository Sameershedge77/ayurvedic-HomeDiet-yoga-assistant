import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from './LoginPage';
import api from '../services/api';

// Mock the API and Navbar to simplify testing
vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock('../components/layout/Navbar', () => ({
  default: () => <nav data-testid="navbar">Mock Navbar</nav>,
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  it('renders login form correctly', () => {
    renderWithRouter(<LoginPage />);
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument();
  });

  it('displays error message on login failure', async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials provided' } },
    });

    renderWithRouter(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials provided')).toBeInTheDocument();
    });
  });

  it('displays success message on successful login', async () => {
    api.post.mockResolvedValueOnce({
      data: { token: 'mock-token', user: { id: 1, role: 'user' } },
    });

    renderWithRouter(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Log in/i }));

    await waitFor(() => {
      expect(screen.getByText('Login successful. Redirecting...')).toBeInTheDocument();
      expect(localStorage.getItem('ayurToken')).toBe('mock-token');
    });
  });
});
