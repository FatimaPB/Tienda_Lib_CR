import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'newlineToHtml',
  standalone: true,
})
export class NewlineToHtmlPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    // Reemplazar saltos de línea con <br>
    return value.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
}
