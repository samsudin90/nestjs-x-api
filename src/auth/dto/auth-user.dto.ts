import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class AuthUserDto {
    @IsString()
    username? : string

    @IsEmail()
    @IsNotEmpty()
    email : string

    @IsNotEmpty()
    @IsString()
    password : string
}