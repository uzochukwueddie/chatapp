import { Pipe, PipeTransform } from '@angular/core';
// import * as _ from 'lodash';


@Pipe({
  name: 'removeDuplicates',
})
export class RemoveDuplicatesPipe implements PipeTransform {
  
  transform(value: any, ...args) {
    // return _.uniqBy(value, 'text');
    return value
  }
}
