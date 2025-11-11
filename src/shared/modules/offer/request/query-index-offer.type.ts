import { Query } from 'express-serve-static-core';

export type QueryIndexOffer = {
  limit?: number;
  page?: number;
} | Query;
