import {IsOptional, IsString} from "class-validator";

// todo: add validation conditions
export class FetchPostsDto {
    @IsString()
    @IsOptional()
    query?: string;
}
