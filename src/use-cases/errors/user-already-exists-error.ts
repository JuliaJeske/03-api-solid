export class UserAlreadyExistsError extends Error {
  constructor() {
    super('e-mail already exists!')
  }
}
