import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto, UpdateBookingDto } from '../../dto/booking.dto';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Создать бронирование' })
  @ApiResponse({ status: 201, description: 'Бронирование успешно создано' })
  create(@Body() dto: CreateBookingDto) {
    return this.bookingService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список бронирований' })
  @ApiResponse({ status: 200, description: 'Список бронирований' })
  findAll(@Query() query: any) {
    return this.bookingService.findAll(query);
  }

  @Get('calendar')
  @ApiOperation({ summary: 'Получить бронирования для календаря' })
  @ApiResponse({ status: 200, description: 'Бронирования за период' })
  getCalendar(
    @Query('branchId') branchId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.bookingService.getCalendar({ branchId, startDate, endDate });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить бронирование по ID' })
  @ApiResponse({ status: 200, description: 'Бронирование найдено' })
  @ApiResponse({ status: 404, description: 'Бронирование не найдено' })
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить бронирование' })
  @ApiResponse({ status: 200, description: 'Бронирование успешно обновлено' })
  @ApiResponse({ status: 404, description: 'Бронирование не найдено' })
  update(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingService.update(id, dto);
  }

  @Put(':id/confirm')
  @ApiOperation({ summary: 'Подтвердить бронирование' })
  @ApiResponse({ status: 200, description: 'Бронирование подтверждено' })
  confirm(@Param('id') id: string) {
    return this.bookingService.confirm(id);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Отменить бронирование' })
  @ApiResponse({ status: 200, description: 'Бронирование отменено' })
  cancel(
    @Param('id') id: string,
    @Body() body: { reason?: string; cancelledBy?: string },
  ) {
    return this.bookingService.cancel(id, body.reason, body.cancelledBy);
  }

  @Put(':id/complete')
  @ApiOperation({ summary: 'Завершить бронирование' })
  @ApiResponse({ status: 200, description: 'Бронирование завершено' })
  complete(@Param('id') id: string) {
    return this.bookingService.complete(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить бронирование' })
  @ApiResponse({ status: 200, description: 'Бронирование удалено' })
  @ApiResponse({ status: 404, description: 'Бронирование не найдено' })
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id);
  }
}
