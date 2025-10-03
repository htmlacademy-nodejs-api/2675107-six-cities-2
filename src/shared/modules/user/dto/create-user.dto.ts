import { UserType } from '../../../types/user.type.js';

export class CreateUserDto {
  public email: string;
  public avatarPath: string | '';
  public firstname: string;
  public password: string;
  public userType: UserType;
}
