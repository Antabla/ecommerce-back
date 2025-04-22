import * as jwt from 'jsonwebtoken';
import { JwtRepositoryImpl } from './jwt.repository.impl';

jest.mock('jsonwebtoken');

describe('JwtRepositoryImpl', () => {
  let jwtRepository: JwtRepositoryImpl;

  beforeEach(() => {
    jwtRepository = new JwtRepositoryImpl();
  });

  describe('create', () => {
    it('should create a JWT token with the given payload', () => {
      const payload = { id: 1, email: 'test@example.com' };
      const secret = 'MYSECRET';
      const token = 'mockJwtToken';

      jest.spyOn(jwt, 'sign').mockImplementation(() => token);

      const result = jwtRepository.create(payload);

      expect(jwt.sign).toHaveBeenCalledWith(JSON.stringify(payload), secret);
      expect(result).toBe(token);
    });

    it('should throw an error if jwt.sign fails', () => {
      const payload = { id: 1, email: 'test@example.com' };

      jest.spyOn(jwt, 'sign').mockImplementation(() => {
        throw new Error('JWT signing failed');
      });

      expect(() => jwtRepository.create(payload)).toThrow('JWT signing failed');
      expect(jwt.sign).toHaveBeenCalledWith(JSON.stringify(payload), 'MYSECRET');
    });
  });
});