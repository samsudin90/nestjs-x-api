import { IsString } from "class-validator";

export class PostDto {
    @IsString()
    body : string
}