import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateUserValidationMessage } from './create-user.message.js';

export class LoginUserDto {
  @IsEmail({}, { message: CreateUserValidationMessage.email.invalid })
  public email: string;

  @IsString({ message: CreateUserValidationMessage.password.invalidFormat })
  @MinLength(6, { message: CreateUserValidationMessage.password.maxLength })
  @MaxLength(12, { message: CreateUserValidationMessage.password.minLength })
  public password: string;
}
