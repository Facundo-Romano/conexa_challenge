class CustomError extends Error {
  constructor(status: number, message: string) {
    super(message);
    this.name = 'CustomError';
    this.status = status;
  }

  status: number;
}

export default CustomError;
