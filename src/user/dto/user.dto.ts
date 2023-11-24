import { IsEmail, IsOptional, IsString } from "class-validator"

export class UserDto {
    @IsString()
    @IsOptional()
    name? : string

    @IsString()
    @IsOptional()
    username? : string

    @IsEmail()
    @IsOptional()
    email? : string

    @IsString()
    @IsOptional()
    image? : string

    @IsString()
    @IsOptional()
    coverImage? : string

    @IsString()
    @IsOptional()
    profileImage? : string

    @IsString()
    @IsOptional()
    hashedPassword? : string
}