import { Injectable } from '@nestjs/common';
import { CryptoRepository } from '../../domain/repositories/crypto.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoRepositoryImpl implements CryptoRepository {
  async hash(value: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(value, saltRounds);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
