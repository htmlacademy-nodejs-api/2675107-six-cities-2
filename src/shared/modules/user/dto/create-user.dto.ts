import { IsEmail, IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { UserType, UserTypeEnum } from '../../../types/user.type.js';
import { CreateUserValidationMessage } from './create-user.message.js';

export class CreateUserDto {
  @IsEmail({}, { message: CreateUserValidationMessage.email.invalid })
  public email: string;

  @IsOptional()
  @IsString({message: CreateUserValidationMessage.avatarPath.invalidFormat })
  @Matches(/\.(jpg|jpeg|png)$/i, {message: CreateUserValidationMessage.avatarPath.invalid})
  public avatarPath: string | '';

  @IsString({ message: CreateUserValidationMessage.firstname.invalidFormat })
  @MinLength(1, { message: CreateUserValidationMessage.firstname.maxLength })
  @MaxLength(15, { message: CreateUserValidationMessage.firstname.minLength })
  public firstname: string;

  @IsString({ message: CreateUserValidationMessage.password.invalidFormat })
  @MinLength(6, { message: CreateUserValidationMessage.password.maxLength })
  @MaxLength(12, { message: CreateUserValidationMessage.password.minLength })
  public password: string;

  @IsEnum(UserTypeEnum, { message: CreateUserValidationMessage.userType.invalid })
  public userType: UserType;
}
