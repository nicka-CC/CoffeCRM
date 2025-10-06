// dto/update-user.dto.ts
import { IsOptional, IsString, IsPhoneNumber, IsNotEmpty, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'image user'
  })
  @IsOptional()
  icon?: string;
  

  @IsOptional()
  @IsString()
  @ApiProperty({example:'golder', description:'gas golder'})
  fullName?: string;

  @IsOptional()
  @ApiProperty({example:'golder', description:'gas golder'})
  @IsPhoneNumber('RU') // или 'ZZ' если без проверки страны
  phone?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({example:'user@example.com', description:'user email'})
  email?: string;

}

export class SearchUsersDto {
  @IsOptional()
  @IsString()
  @ApiProperty({example:'John', description:'search by name', required: false})
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({example:'0', description:'page number', required: false})
  page?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({example:'10', description:'items per page', required: false})
  limit?: string;
}
