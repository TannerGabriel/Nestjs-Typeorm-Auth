import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.url;
        const now = Date.now();

        return next.handle().pipe(
            tap(() => Logger.log(`${method} ${url} ${Date.now() - now}ms`, context.getClass().name)),
        );
    }
}