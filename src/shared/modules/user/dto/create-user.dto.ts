import { IsEmail, IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { UserType, UserTypeEnum } from '../../../types/user.type.js';
import { CreateUserValidationMessage } from './create-user.message.js';

export class CreateUserDto {
  @IsEmail({}, { message: CreateUserValidationMessage.email.invalid })
  public email: string;

  @IsString({ message: CreateUserValidationMessage.firstname.invalidFormat })
  @MinLength(1, { message: CreateUserValidationMessage.firstname.minLength })
  @MaxLength(15, { message: CreateUserValidationMessage.firstname.maxLength })
  public firstname: string;

  @IsString({ message: CreateUserValidationMessage.password.invalidFormat })
  @MinLength(6, { message: CreateUserValidationMessage.password.minLength })
  @MaxLength(12, { message: CreateUserValidationMessage.password.maxLength })
  public password: string;

  @IsEnum(UserTypeEnum, { message: CreateUserValidationMessage.userType.invalid })
  public userType: UserType;
}
