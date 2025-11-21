import { UserType } from '../../const';

export class CreateUserDto {
  public email!: string;
  public firstname!: string;
  public password!: string;
  public userType!: UserType;
}
