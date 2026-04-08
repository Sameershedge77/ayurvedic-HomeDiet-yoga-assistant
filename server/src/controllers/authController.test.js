import { jest } from '@jest/globals';

// Mock dependencies
jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    hash: jest.fn(),
    compare: jest.fn()
  }
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: jest.fn()
  }
}));

jest.unstable_mockModule('../models/user.js', () => ({
  default: {
    findByEmail: jest.fn(),
    create: jest.fn()
  }
}));

// Dynamic imports are required when using unstable_mockModule
const { login, register } = await import('./authController.js');
const bcrypt = (await import('bcryptjs')).default;
const jwt = (await import('jsonwebtoken')).default;
const User = (await import('../models/user.js')).default;

describe('authController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return 400 if user explicitly not found', async () => {
      req.body = { email: 'test@test.com', password: 'password123' };
      User.findByEmail.mockResolvedValue(null);

      await login(req, res);

      expect(User.findByEmail).toHaveBeenCalledWith('test@test.com');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });

    it('should return 400 if passwords do not match', async () => {
      req.body = { email: 'test@test.com', password: 'password123' };
      User.findByEmail.mockResolvedValue({ id: 1, password: 'hashedpassword' });
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return a token on successful login', async () => {
      req.body = { email: 'test@test.com', password: 'password123' };
      const mockUser = { id: 1, password: 'hashedpassword', name: 'Test User' };
      User.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mocked_token');
      process.env.JWT_SECRET = 'secret';

      await login(req, res);

      expect(jwt.sign).toHaveBeenCalledWith({ id: mockUser.id }, 'secret', { expiresIn: "7d" });
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        token: 'mocked_token',
        user: mockUser
      });
    });
  });

  describe('register', () => {
    it('should return 400 if user email already exists', async () => {
      req.body = { name: 'Test', email: 'test@test.com', password: 'pass', role: 'user' };
      User.findByEmail.mockResolvedValue({ id: 1 });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Email already exists" });
    });

    it('should register a user successfully', async () => {
      req.body = { name: 'Test', email: 'test@test.com', password: 'pass', role: 'user' };
      User.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedpass');
      User.create.mockResolvedValue(true);

      await register(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('pass', 10);
      expect(User.create).toHaveBeenCalledWith('Test', 'test@test.com', 'hashedpass', 'user');
      expect(res.json).toHaveBeenCalledWith({ message: "Registration successful" });
    });
  });
});
