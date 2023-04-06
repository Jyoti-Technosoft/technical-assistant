import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})

export class FilterPipe implements PipeTransform {
  transform(quizs: any[], searchText: string): any {
    return quizs
      ? quizs.filter(
          (item) => item.quizId.search(new RegExp(searchText, 'i')) > -1
        )
      : [];
  }
}
