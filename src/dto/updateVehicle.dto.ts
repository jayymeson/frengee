import { IsString, IsInt, IsOptional } from "class-validator";

export class UpdateVehicleDTO {
  @IsString()
  @IsOptional()
  make?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsInt()
  @IsOptional()
  year?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
