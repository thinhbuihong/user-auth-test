import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class GoogleSwaggerCodeDecodeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const referer: string = req.headers.referer || '';

    const url: string = req?.url || '';

    if (url.includes('/auth/google/callback') && referer.includes('docs')) {
      // Get the code from the url and decode it if it is double encoded (Swagger UI)
      const codeMatch = url.match(/code=([^&]+)/);
      if (codeMatch) {
        const code = codeMatch[1];

        // Always decode once if from Swagger UI (not just when %25)
        const decodedCode = decodeURIComponent(code);

        // Update url and query
        req.url = url.replace(`code=${code}`, `code=${decodedCode}`);
        req.originalUrl = req.url;

        // Re-parse query string after updating URL
        const urlParts = req.url.split('?');
        if (urlParts[1]) {
          const queryParams = new URLSearchParams(urlParts[1]);
          req.query = Object.fromEntries(queryParams.entries());
        }
      }
    }

    next();
  }
}
