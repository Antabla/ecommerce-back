import * as jwt from 'jsonwebtoken';
import { JwtRepository } from '../../domain/repositories/jwt.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtRepositoryImpl implements JwtRepository {
  private readonly SECRET = 'MYSECRET';

  create(payload: any): string {
    return jwt.sign(JSON.stringify(payload), this.SECRET);
  }
  
}
