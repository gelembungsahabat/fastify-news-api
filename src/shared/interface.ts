export interface QueryString {
  size?: number;
  page?: number;
  get_all?: boolean;
  status?: 'draft' | 'publish' | 'deleted';
  topic?: string;
}
