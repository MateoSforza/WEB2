import { IsString, MinLength, MaxLength, IsEmail, IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(30)
    name?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(30)
    lastName?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    age?: number;
}
