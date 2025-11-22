import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../../../prisma/prisma/prisma.service';
import {JwtAuthGuard} from "../../jwt-auth.guard";
import { JwtModule } from '@nestjs/jwt';
import {AuthService} from "../../user/auth/signup-service";
// AuthModule
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AnalyticsController],
  providers: [AuthService,AnalyticsService, PrismaService],
  exports: [JwtModule,AnalyticsService], // <-- экспортируем JwtModule
})
export class AnalyticsModule {}
