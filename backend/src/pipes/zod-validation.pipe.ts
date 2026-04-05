import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch {
      throw new BadRequestException({
        message: 'Bad Request',
      });
    }
  }
}
