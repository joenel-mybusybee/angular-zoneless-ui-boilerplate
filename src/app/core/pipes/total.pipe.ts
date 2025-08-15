import { Pipe, PipeTransform } from '@angular/core';

/*
 * Pipe to calculate the total of a specific property in an array of objects.
 * Usage: {{ rows | total: 'propertyName' }}
 */
@Pipe({
  name: 'total',
  standalone: true,
})
export class TotalPipe implements PipeTransform {
  transform(rows: any[], prop: string): number {
    if (!rows || !prop) return 0;

    return rows.reduce((sum, row) => {
      const value = row[prop];
      if (typeof value === 'number' && !isNaN(value)) {
        return sum + value;
      }
      return sum;
    }, 0);
  }
}
