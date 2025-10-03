export type UserType = 'ordinary' | 'pro';

export type User = {
  firstname: string; // Имя пользователя (1-15 символов)
  email: string; // Валидный email, уникальный
  avatarPath?: string | ''; // Аватар (jpg/png), необязательный
  password: string; // Пароль (6-12 символов)
  userType: UserType; // Тип пользователя
};
