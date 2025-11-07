import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { PrismaService } from '../../../prisma/prisma/prisma.service';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, PrismaService],
  exports: [EmployeeService],
})
export class EmployeeModule {}

