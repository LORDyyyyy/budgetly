import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('db')
export class PrismaController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('')
  checkDbConnection() {
    return this.prismaService.$queryRaw`SELECT 1`
      .then(() => ({
        status: 'Database connection successful',
      }))
      .catch((error) => ({
        status: 'Database connection failed',
        error: error.message,
      }));
  }
}
