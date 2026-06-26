import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateAccountDto {
    @IsString()
    operator: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password is too weak'
    })
    password: string;
}

