export class ValidationError extends Error {
  constructor(message: string, private description?: string) {
    super(message);
  }

  toString() {
    return `${this.message} [${this.description}]`;
  }
}
