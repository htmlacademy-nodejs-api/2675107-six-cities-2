import { Query } from 'express-serve-static-core';

export type QueryIndexOffer = {
  userId: string;
  limit?: number;
  page?: number;
} | Query;
