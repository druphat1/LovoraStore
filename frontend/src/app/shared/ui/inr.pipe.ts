import { Pipe, PipeTransform } from '@angular/core';
import { formatINR } from '../../core/lib/format';

@Pipe({ name: 'inr' })
export class InrPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return formatINR(value ?? 0);
  }
}
