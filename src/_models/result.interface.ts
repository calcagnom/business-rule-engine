import {EventTypeEnum} from '../_enums/event-type.enum';

export interface IResult {
  type: (EventTypeEnum | string);
  params?: any;
}
