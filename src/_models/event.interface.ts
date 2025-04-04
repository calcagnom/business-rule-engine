import {EventTypeEnum} from '../_enums/event-type.enum';

export interface IEvent {
  types: (EventTypeEnum | string)[];
  params: any;
}
