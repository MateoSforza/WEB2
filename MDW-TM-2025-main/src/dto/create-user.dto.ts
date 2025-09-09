import { IsString, MinLength, MaxLength, IsEmail, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(2)
    @MaxLength(30)
    name!: string;

    @IsString()
    @MinLength(2)
    @MaxLength(30)
    lastName!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string; // <-- AGREGA ESTO

    @IsOptional()
    @IsNumber()
    @Min(0)
    age?: number;
}
