export default interface ApiResponse<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}
