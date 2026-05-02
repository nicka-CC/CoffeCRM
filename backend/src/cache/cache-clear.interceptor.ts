import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { CacheService } from './cache.service';

@Injectable()
export class CacheClearInterceptor implements NestInterceptor {
  constructor(private readonly cacheService: CacheService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;

    // Очищаем кэш при изменении данных (POST, PUT, PATCH, DELETE)
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle().pipe(
        tap(async () => {
          // Очищаем кэш для связанных ресурсов
          await this.clearRelatedCache(url, method);
        }),
      );
    }

    return next.handle();
  }

  private async clearRelatedCache(url: string, method: string): Promise<void> {
    try {
      // Определяем паттерны для очистки кэша в зависимости от измененного ресурса
      const patterns: string[] = [];

      if (url.includes('/user')) {
        patterns.push('cache:/user/*');
        patterns.push('cache:/user/all*');
        if (method === 'DELETE' || method === 'PATCH') {
          // При удалении/обновлении пользователя очищаем его кэш
          const userId = url.split('/').pop();
          if (userId) {
            patterns.push(`cache:/user/${userId}*`);
          }
        }
      }

      if (url.includes('/products')) {
        patterns.push('cache:/products*');
        patterns.push('cache:/categories*');
      }

      if (url.includes('/categories')) {
        patterns.push('cache:/categories*');
        patterns.push('cache:/products*');
      }

      if (url.includes('/branches')) {
        patterns.push('cache:/branches*');
        patterns.push('cache:/dashboard*');
      }

      if (url.includes('/orders')) {
        patterns.push('cache:/orders*');
        patterns.push('cache:/dashboard*');
        patterns.push('cache:/analytics*');
      }

      if (url.includes('/bookings')) {
        patterns.push('cache:/bookings*');
        patterns.push('cache:/dashboard*');
      }

      if (url.includes('/customers')) {
        patterns.push('cache:/customers*');
        patterns.push('cache:/dashboard*');
      }

      if (url.includes('/employees')) {
        patterns.push('cache:/employees*');
        patterns.push('cache:/dashboard*');
      }

      if (url.includes('/stocks') || url.includes('/inventory')) {
        patterns.push('cache:/stocks*');
        patterns.push('cache:/inventory*');
      }

      // Очищаем dashboard и analytics при любых изменениях
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        patterns.push('cache:/dashboard*');
        patterns.push('cache:/analytics*');
      }

      // Очищаем кэш по паттернам
      for (const pattern of patterns) {
        await this.cacheService.delPattern(pattern);
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

