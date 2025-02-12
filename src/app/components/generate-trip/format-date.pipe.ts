import { Pipe, PipeTransform } from '@angular/core';
import { TuiDay } from '@taiga-ui/cdk';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
  transform(value: number): string {
    return new Date(value).toLocaleDateString();
  }
}