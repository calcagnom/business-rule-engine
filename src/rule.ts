import type {IRule} from './_models/rule.interface.js';
import FactMap from './fact-map.js';
import type OperatorMap from './operator-map.js';
import type {IResult} from './_models/result.interface.js';
import {EventTypeEnum} from './_enums/event-type.enum.js';
import {Condition} from './condition.js';

export default class Rule {
  private rule: IRule;
  private readonly facts: FactMap;
  private readonly operators: OperatorMap;

  constructor(rule: IRule, operators: OperatorMap) {
    this.rule = rule;
    if (!rule) {
      throw new Error('Missing rule');
    }
    if (!rule.name) {
      throw new Error('Missing rule name');
    }
    if (!rule.attributes?.length) {
      throw new Error('Missing rule attributes');
    }
    this.facts = new FactMap(rule.attributes);
    this.operators = operators;
  }

  evaluate(jsonValue: any): IResult[] {
    try {
      const eventResult: IResult[] = [];
      this.rule.decisions.forEach(decision => {
        const requireSuccess = !decision.event || decision.event?.types?.some((type: EventTypeEnum | string) => type === EventTypeEnum.success || type === EventTypeEnum.successOrFail);
        const requireFail = !decision.event || decision.event?.types?.some((type: EventTypeEnum | string) => type === EventTypeEnum.fail || type === EventTypeEnum.successOrFail);
        const hasCustom = decision.event?.types?.some((type: EventTypeEnum | string) => !Object.values(EventTypeEnum).includes(type as EventTypeEnum));
        const decisionResult = new Condition(decision.conditions).resolve(jsonValue, this.facts, this.operators);
        if (decisionResult && requireSuccess) {
          if (requireSuccess) {
            eventResult.push({type: EventTypeEnum.success});
          }
          if (hasCustom) {
            eventResult.push(...decision.event.types.map((type: EventTypeEnum | string) => ({type, params: decision.event.params})));
          }
        }
        if (!decisionResult && requireFail) {
          eventResult.push({type: EventTypeEnum.fail});
        }
      });
      return eventResult;
    } catch (e) {
      return [];
    }
  }
}
