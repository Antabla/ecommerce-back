export interface JwtRepository {
  create(payload: any): string;
}
