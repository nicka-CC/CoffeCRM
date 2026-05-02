# Redis Cache Setup

## Установка Redis

### Windows
1. Скачайте Redis для Windows: https://github.com/microsoftarchive/redis/releases
2. Или используйте WSL2 с Redis
3. Или используйте Docker: `docker run -d -p 6379:6379 redis:alpine`

### Linux/Mac
```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# Mac (Homebrew)
brew install redis

# Запуск Redis
redis-server
```

## Настройка переменных окружения

Создайте файл `.env` в корне проекта `backend/` или добавьте переменные в существующий:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=  # Оставьте пустым, если пароль не установлен
```

## Установка зависимостей

```bash
cd backend
npm install
```

## Проверка работы

После запуска приложения в логах должно появиться:
- `Redis Client Connected`
- `Redis connection established`

Если Redis недоступен, приложение продолжит работать без кэширования (в логах будет предупреждение).

## Как работает кэширование

1. **GET запросы** автоматически кэшируются с разным TTL:
   - Dashboard: 60 секунд
   - Analytics: 300 секунд (5 минут)
   - Users: 180 секунд (3 минуты)
   - Products/Categories: 300 секунд (5 минут)
   - Branches: 300 секунд (5 минут)
   - Orders/Bookings: 120 секунд (2 минуты)
   - Customers/Employees: 300 секунд (5 минут)
   - Stocks/Inventory: 180 секунд (3 минуты)
   - По умолчанию: 300 секунд (5 минут)

2. **POST/PUT/PATCH/DELETE запросы** автоматически очищают связанный кэш

3. Кэш исключает:
   - `/auth` endpoints
   - `/api` endpoints (Swagger)

## Отключение кэширования

Если нужно временно отключить кэш, просто не запускайте Redis сервер. Приложение будет работать без кэширования.

