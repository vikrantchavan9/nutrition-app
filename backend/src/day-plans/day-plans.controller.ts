import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import { DayPlansService } from './day-plans.service';
import { CreateDayPlanDto } from './dto/create-day-plan.dto';
import { UpdateDayPlanDto } from './dto/update-day-plan.dto';
import { ApplyDayPlanDto } from './dto/apply-day-plan.dto';
import { ApplyYesterdayDto } from './dto/apply-yesterday.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('day-plans')
// @UseGuards(JwtAuthGuard)  // Temporarily disabled for testing
export class DayPlansController {
    constructor(private readonly dayPlansService: DayPlansService) { }

    @Post()
    create(@Request() req, @Body() createDto: CreateDayPlanDto) {
        const userId = req?.user?.sub || 'demo-user';
        return this.dayPlansService.create(userId, createDto);
    }

    @Get()
    findAll(@Request() req) {
        const userId = req?.user?.sub || 'demo-user';
        return this.dayPlansService.findAll(userId);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        const userId = req?.user?.sub || 'demo-user';
        return this.dayPlansService.findOne(userId, id);
    }

    @Patch(':id')
    update(
        @Request() req,
        @Param('id') id: string,
        @Body() updateDto: UpdateDayPlanDto
    ) {
        const userId = req?.user?.sub || 'demo-user';
        return this.dayPlansService.update(userId, id, updateDto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        const userId = req?.user?.sub || 'demo-user';
        return this.dayPlansService.remove(userId, id);
    }

    @Post(':id/apply')
    apply(
        @Request() req,
        @Param('id') id: string,
        @Body() applyDto: ApplyDayPlanDto
    ) {
        const userId = req?.user?.sub || 'demo-user';
        return this.dayPlansService.apply(userId, id, applyDto);
    }

    @Post('apply-yesterday')
    applyYesterday(@Request() req, @Body() applyDto: ApplyYesterdayDto) {
        const userId = req?.user?.sub || 'demo-user';
        return this.dayPlansService.applyYesterday(userId, applyDto);
    }
}
