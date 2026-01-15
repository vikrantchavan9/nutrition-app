import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class ApplyDayPlanDto {
    @IsString()
    date: string; // Format: YYYY-MM-DD

    @IsBoolean()
    @IsOptional()
    replaceExisting?: boolean = true;
}
