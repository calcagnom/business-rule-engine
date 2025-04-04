import type {EventTypeEnum} from '../_enums/event-type.enum.js';

export interface IResult {
  type: (EventTypeEnum | string);
  params?: any;
}
