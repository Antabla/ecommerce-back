export class UserInvalidInfoError extends Error {
  constructor() {
    super('User information is invalid');
    this.name = 'UserInvalidInfoError';
  }
}
