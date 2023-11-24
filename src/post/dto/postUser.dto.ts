import { IsNotEmpty, IsString } from "class-validator";

export class PostUserDto {
    @IsNotEmpty()
    @IsString()
    id : string
}