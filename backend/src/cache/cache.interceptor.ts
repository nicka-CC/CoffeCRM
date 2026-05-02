import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { CacheService } from './cache.service';
import { SKIP_CACHE_KEY } from './skip-cache.decorator';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheService: CacheService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, query, params } = request;

    // Проверяем, нужно ли пропустить кэширование через декоратор
    const skipCache = this.reflector.getAllAndOverride<boolean>(SKIP_CACHE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipCache) {
      return next.handle();
    }

    // Кэшируем только GET запросы
    if (method !== 'GET') {
      return next.handle();
    }

    // Исключаем некоторые пути из кэширования (например, auth endpoints)
    const excludedPaths = ['/auth', '/api'];
    if (excludedPaths.some((path) => url.startsWith(path))) {
      return next.handle();
    }

    // Генерируем ключ кэша на основе URL и query параметров
    const cacheKey = this.generateCacheKey(url, query, params);

    // Пытаемся получить данные из кэша
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) {
      return of(cachedData);
    }

    // Если данных нет в кэше, выполняем запрос и кэшируем результат
    return next.handle().pipe(
      tap(async (data) => {
        // Определяем TTL в зависимости от типа данных
        const ttl = this.getTTL(url);
        await this.cacheService.set(cacheKey, data, ttl);
      }),
    );
  }

  private generateCacheKey(
    url: string,
    query: any,
    params: any,
  ): string {
    // Убираем query параметры из URL для базового ключа
    const baseUrl = url.split('?')[0].replace(/\/$/, ''); // Убираем trailing slash
    
    // Добавляем query параметры к ключу, если они есть
    const queryKeys = Object.keys(query).filter(key => query[key] !== undefined && query[key] !== null && query[key] !== '');
    const queryString = queryKeys.length > 0
      ? queryKeys
          .sort()
          .map((key) => `${key}=${encodeURIComponent(String(query[key]))}`)
          .join('&')
      : '';
    
    // Добавляем params к ключу (исключаем пустые значения)
    const paramKeys = Object.keys(params).filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '');
    const paramsString = paramKeys.length > 0
      ? paramKeys
          .sort()
          .map((key) => `${key}=${encodeURIComponent(String(params[key]))}`)
          .join('&')
      : '';

    const keyParts = [baseUrl];
    if (queryString) keyParts.push(`q:${queryString}`);
    if (paramsString) keyParts.push(`p:${paramsString}`);

    // Используем более короткий формат ключа
    return `cache:${keyParts.join(':')}`;
  }

  private getTTL(url: string): number {
    // Разные TTL для разных типов данных
    if (url.includes('/dashboard')) {
      return 60; // 1 минута для dashboard
    }
    if (url.includes('/analytics')) {
      return 300; // 5 минут для аналитики
    }
    if (url.includes('/user/me') || url.includes('/user/all')) {
      return 180; // 3 минуты для пользователей
    }
    if (url.includes('/products') || url.includes('/categories')) {
      return 300; // 5 минут для товаров и категорий
    }
    if (url.includes('/branches')) {
      return 300; // 5 минут для филиалов
    }
    if (url.includes('/orders') || url.includes('/bookings')) {
      return 120; // 2 минуты для заказов и бронирований
    }
    if (url.includes('/customers') || url.includes('/employees')) {
      return 300; // 5 минут для клиентов и сотрудников
    }
    if (url.includes('/stocks') || url.includes('/inventory')) {
      return 180; // 3 минуты для склада
    }
    
    // По умолчанию 5 минут
    return 300;
  }
}

