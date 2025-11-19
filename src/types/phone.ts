export type Phone = {
  id?: number;
  brand: string;
  name: string;
  yearStart: number;
  yearEnd: number | null;
  kept: boolean;
  liked: boolean;
  image: string;
  createdAt?: string;
  updatedAt?: string;
};
