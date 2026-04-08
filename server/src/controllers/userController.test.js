import { jest } from '@jest/globals';
import { getUserAppointments } from './userController.js';
import db from '../config/db.js';

// Mock the db module
jest.unstable_mockModule('../config/db.js', () => ({
  default: {
    promise: jest.fn().mockReturnValue({
      query: jest.fn()
    })
  }
}));

describe('userController - getUserAppointments', () => {
  let req;
  let res;

  beforeEach(() => {
    req = { params: { userId: '1' } };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  it('should return null data if no appointments found', async () => {
    // Override the mock implementation for this specific test
    const mockQuery = jest.fn().mockResolvedValue([[]]);
    db.promise = jest.fn().mockReturnValue({ query: mockQuery });

    await getUserAppointments(req, res);

    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: null });
  });

  it('should return the latest appointment data', async () => {
    const mockData = { id: 1, problem: 'Headache', status: 'pending' };
    const mockQuery = jest.fn().mockResolvedValue([[mockData]]);
    db.promise = jest.fn().mockReturnValue({ query: mockQuery });

    await getUserAppointments(req, res);

    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: mockData });
  });

  it('should return 500 on database error', async () => {
    const mockQuery = jest.fn().mockRejectedValue(new Error('DB Error'));
    db.promise = jest.fn().mockReturnValue({ query: mockQuery });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await getUserAppointments(req, res);

    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false });

    consoleSpy.mockRestore();
  });
});
