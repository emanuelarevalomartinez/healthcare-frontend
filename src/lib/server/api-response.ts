export interface ApiResponse<T> {
  status: number;
  type: string | null;
  message: string | null;
  origin: string | null;
  data: T;
  error: any | null;
}

export interface PaginatedData<ContentShape> {
  content: ContentShape[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
