import {Pipe, PipeTransform} from '@angular/core'
import * as moment from 'moment';
@Pipe({ name: 'dateLocal'})
export class DateLocalPipe implements PipeTransform{
  transform(val) {
    if(val){
    return moment(val).format();
    }
  }
}
