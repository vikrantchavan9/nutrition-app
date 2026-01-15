import { IsString, IsObject, IsOptional } from 'class-validator';

export class UpdateDayPlanDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsObject()
    @IsOptional()
    meals?: {
        breakfast?: string;
        lunch?: string;
        dinner?: string;
        snacks?: string;
    };
}
