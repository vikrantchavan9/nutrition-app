import { IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { SavedMealItemDto } from './create-saved-meal.dto';

export class UpdateSavedMealDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SavedMealItemDto)
    @IsOptional()
    items?: SavedMealItemDto[];
}
