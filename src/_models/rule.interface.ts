import type {IFact} from './fact.interface.js';
import type {ICondition} from './condition.interface.js';
import type {IEvent} from './event.interface.js';


export interface IRule {
  name?: string;
  attributes: IFact[];
  decisions: {conditions: ICondition, event?: IEvent}[];
}
