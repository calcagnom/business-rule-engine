import type {EventTypeEnum} from '../_enums/event-type.enum.js';

export interface IEvent {
  types: (EventTypeEnum | string)[];
  params: any;
}
