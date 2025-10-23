import { Query } from 'express-serve-static-core';

export type QueryUserId = {
  userId: string;
} | Query;
