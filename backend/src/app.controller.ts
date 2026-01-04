import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly db: DatabaseService,) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('db-health')
  async dbHealth() {
    const result = await this.db.query('SELECT 1 as ok');
    return { db: result[0].ok === 1 };
  }
}
