export interface Comment {
  _id: string;
  comment: string;
  author: string;
  date: string;
}

export interface Post {
  _id: string;
  title: string;
  body: string;
  excerpt?: string;
  category: string;
  author: string;
  /** Publication date as `YYYY-MM-DD` (set by the author). */
  date: string;
  image: string;
  tags?: string[];
  /** `false` means pending review / not approved. */
  publication?: boolean;
  publisher?: string;
  comments: Comment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phone?: string;
  role?: string;
}
