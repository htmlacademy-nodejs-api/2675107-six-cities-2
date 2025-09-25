import { User } from './user.type.js';

export type Comment = {
  text: string; // Текст комментария (5-1024 символа)
  postDate: Date; // Дата публикации
  rating: number; // 1-5
  author: User; // Автор комментария
};
