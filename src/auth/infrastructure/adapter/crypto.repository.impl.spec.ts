import { CryptoRepositoryImpl } from './crypto.repository.impl';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('CryptoRepositoryImpl', () => {
  let cryptoRepository: CryptoRepositoryImpl;

  beforeEach(() => {
    cryptoRepository = new CryptoRepositoryImpl();
  });

  describe('hash', () => {
    it('should hash a value using bcrypt', async () => {
      const value = 'plainPassword';
      const hashedValue = 'hashedPassword';
      const saltRounds = 10;

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedValue);

      const result = await cryptoRepository.hash(value);

      expect(bcrypt.hash).toHaveBeenCalledWith(value, saltRounds);
      expect(result).toBe(hashedValue);
    });

    it('should throw an error if bcrypt.hash fails', async () => {
      const value = 'plainPassword';

      jest.spyOn(bcrypt, 'hash').mockRejectedValue(new Error('Hashing failed'));

      await expect(cryptoRepository.hash(value)).rejects.toThrow('Hashing failed');
      expect(bcrypt.hash).toHaveBeenCalledWith(value, 10);
    });
  });

  describe('compare', () => {
    it('should compare a plain value with a hash using bcrypt', async () => {
      const plain = 'plainPassword';
      const hash = 'hashedPassword';

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await cryptoRepository.compare(plain, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(plain, hash);
      expect(result).toBe(true);
    });

    it('should return false if bcrypt.compare fails to match', async () => {
      const plain = 'plainPassword';
      const hash = 'hashedPassword';

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await cryptoRepository.compare(plain, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(plain, hash);
      expect(result).toBe(false);
    });

    it('should throw an error if bcrypt.compare fails', async () => {
      const plain = 'plainPassword';
      const hash = 'hashedPassword';

      jest.spyOn(bcrypt, 'compare').mockRejectedValue(new Error('Comparison failed'));

      await expect(cryptoRepository.compare(plain, hash)).rejects.toThrow('Comparison failed');
      expect(bcrypt.compare).toHaveBeenCalledWith(plain, hash);
    });
  });
});