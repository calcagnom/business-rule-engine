import {IFact} from './fact.interface';
import {ICondition} from './condition.interface';
import {IEvent} from './event.interface';

export interface IRule {
  name?: string;
  attributes: IFact[];
  decisions: {conditions: ICondition, event?: IEvent}[];
}
