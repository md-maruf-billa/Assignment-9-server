export interface Category {
  id: string;
  name: string;
  reviews?: Review[];
}

export interface Account {
  id: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
  status: Status;
  isActive: ActiveStatus;
  isDeleted: boolean;

  user?: User | null;
  company?: Company | null;
  admin?: Admin | null;

  reviews?: Review[];
  votes?: Vote[];
}

export interface User {
  id: string;
  name: string;
  accountId: string;
  account: Account;

  profileImage?: string | null;
  bio?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  accountId: string;
  account: Account;

  products?: Product[];

  website?: string | null;
  companyImage?: string | null;
  description?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
  id: string;
  name: string;
  accountId: string;
  account: Account;

  profileImage?: string | null;
  bio?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  imageUrl?: string | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  reviews?: Review[];

  companyId?: string | null;
  company?: Company | null;
}

export interface Review {
  id: string;
  title: string;
  description: string;
  rating: number;
  categoryId: string;
  category: Category;
  productId?: string | null;
  product?: Product | null;

  purchaseSource?: string | null;
  images: string[];
  isPremium: boolean;

  userId: string;
  user: Account;
  status: ReviewStatus;
  moderationNote?: string | null;

  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;

  votes?: Vote[];
}

export interface Vote {
  id: string;
  reviewId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  review: Review;
  user: Account;
}

export enum Role {
  USER = 'USER',
  COMPANY = 'COMPANY',
  ADMIN = 'ADMIN',
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum ActiveStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  UNPUBLISHED = 'UNPUBLISHED',
}
