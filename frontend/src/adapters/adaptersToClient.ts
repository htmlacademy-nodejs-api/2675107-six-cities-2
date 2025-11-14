import { CreateUserDto } from '../dto/users/create-user.dto';
import { UserRegister } from '../types/types';

export const adaptSignupToServer =
  (user: UserRegister): CreateUserDto => ({
    firstname: user.name,
    email: user.email,
    password: user.password,
    userType: user.userType
  });
