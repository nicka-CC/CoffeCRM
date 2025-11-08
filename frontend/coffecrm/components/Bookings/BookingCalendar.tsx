'use client';

import React, { useState, useMemo } from 'react';
import { Box, Paper, Typography, Chip, Grid, IconButton, Stack } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import type { Booking } from '@/types/bookings';
import { formatDate } from '@/utils/formatters';

interface BookingCalendarProps {
  bookings: Booking[];
  onBookingClick: (booking: Booking) => void;
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  bookings,
  onBookingClick,
  selectedDate,
  onDateSelect,
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());

  const bookingsByDate = useMemo(() => {
    const grouped: Record<string, Booking[]> = {};
    bookings.forEach((booking) => {
      const dateKey = formatDate(booking.date);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(booking);
    });
    return grouped;
  }, [bookings]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  // Преобразуем: понедельник = 1, воскресенье = 7
  const firstDayOfMonth = firstDay === 0 ? 6 : firstDay - 1;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const getDateKey = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return formatDate(date.toISOString());
  };

  const statusColors: Record<string, string> = {
    PENDING: '#ff9800',
    CONFIRMED: '#2196f3',
    COMPLETED: '#4caf50',
    CANCELED: '#f44336',
    NO_SHOW: '#9e9e9e',
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {currentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
        </Typography>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={handlePrevMonth} size="small">
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={handleNextMonth} size="small">
            <ChevronRight />
          </IconButton>
        </Stack>
      </Box>

      <Grid container spacing={1}>
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
          <Grid item xs={12 / 7} key={day}>
            <Box
              sx={{
                textAlign: 'center',
                fontWeight: 600,
                color: 'text.secondary',
                py: 1,
              }}
            >
              {day}
            </Box>
          </Grid>
        ))}

        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <Grid item xs={12 / 7} key={`empty-${i}`} />
        ))}

        {days.map((day) => {
          const dateKey = getDateKey(day);
          const dayBookings = bookingsByDate[dateKey] || [];
          const isToday =
            day === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear();

          return (
            <Grid item xs={12 / 7} key={day}>
              <Paper
                sx={{
                  p: 1,
                  minHeight: 80,
                  border: isToday ? '2px solid #6366f1' : '1px solid #e2e8f0',
                  backgroundColor: isToday ? '#f0f4ff' : 'white',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                  },
                }}
                onClick={() => handleDateClick(day)}
              >
                <Typography variant="body2" sx={{ fontWeight: isToday ? 700 : 400, mb: 0.5 }}>
                  {day}
                </Typography>
                {dayBookings.length > 0 && (
                  <Stack spacing={0.5}>
                    {dayBookings.slice(0, 2).map((booking) => (
                      <Chip
                        key={booking.id}
                        label={`${new Date(booking.timeFrom).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })} ${booking.title || booking.customer?.user?.fullName || ''}`}
                        size="small"
                        sx={{
                          fontSize: '0.7rem',
                          height: 20,
                          backgroundColor: statusColors[booking.status] || '#e0e0e0',
                          color: 'white',
                          cursor: 'pointer',
                          '&:hover': {
                            opacity: 0.8,
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookingClick(booking);
                        }}
                      />
                    ))}
                    {dayBookings.length > 2 && (
                      <Typography variant="caption" color="text.secondary">
                        +{dayBookings.length - 2} еще
                      </Typography>
                    )}
                  </Stack>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default BookingCalendar;

