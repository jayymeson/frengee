import { IsString, IsInt } from 'class-validator';

export class CreateVehicleDTO {
  @IsString()
  make!: string;

  @IsString()
  model!: string;

  @IsInt()
  year!: number;

  @IsString()
  imageUrl?: string;
}
