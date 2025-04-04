import type {ICondition, IFactCondition} from './_models/condition.interface.js';
import {ConditionOperatorsEnum} from './_enums/condition-operators.enum.js';
import type FactMap from './fact-map.js';
import type OperatorMap from './operator-map.js';
import type {IFact} from './_models/fact.interface.js';

export class Condition {

  condition: ICondition | IFactCondition;
  operator: ConditionOperatorsEnum | undefined;

  constructor(condition: ICondition | IFactCondition) {
    if (!condition) { throw new Error('Condition: constructor options required'); }
    this.condition = condition;
    const booleanOperator = this.booleanOperator(condition);
    if (booleanOperator) {
      // @ts-ignore
      const subConditions = this.condition[booleanOperator];
      const subConditionsIsArray = Array.isArray(subConditions);
      if (booleanOperator !== 'not' && !subConditionsIsArray) { throw new Error(`"${booleanOperator}" must be an array`); }
      if (booleanOperator === 'not' && subConditionsIsArray) { throw new Error(`"${booleanOperator}" cannot be an array`); }
      this.operator = booleanOperator;
      if (subConditionsIsArray) {
        // @ts-ignore
        this[booleanOperator] = subConditions.map((c) => new Condition(c));
      } else {
        // @ts-ignore
        this[booleanOperator] = new Condition(subConditions);
      }
    } else if (!Object.prototype.hasOwnProperty.call(this.condition, 'condition')) {
      if (!Object.prototype.hasOwnProperty.call(this.condition, 'fact')) { throw new Error('Condition: constructor "fact" property required'); }
      if (!Object.prototype.hasOwnProperty.call(this.condition, 'operator')) { throw new Error('Condition: constructor "operator" property required'); }
      if (!Object.prototype.hasOwnProperty.call(this.condition, 'value')) { throw new Error('Condition: constructor "value" property required'); }
    }
  }

  /**
   * Returns the boolean operator for the condition
   * If the condition is not a boolean condition, the result will be 'undefined'
   * @return {string 'all', 'any', or 'not'}
   */
  booleanOperator (condition: ICondition | IFactCondition): ConditionOperatorsEnum | undefined {
    if (Object.prototype.hasOwnProperty.call(condition, ConditionOperatorsEnum.ANY)) {
      return ConditionOperatorsEnum.ANY;
    } else if (Object.prototype.hasOwnProperty.call(condition, ConditionOperatorsEnum.AND)) {
      return ConditionOperatorsEnum.AND;
    } else if (Object.prototype.hasOwnProperty.call(condition, ConditionOperatorsEnum.NOT)) {
      return ConditionOperatorsEnum.NOT;
    }
  }

  resolve(jsonValue: any, facts: FactMap, operators: OperatorMap): boolean {
    if (this.operator) {
      switch (this.operator) {
        case ConditionOperatorsEnum.NOT:
          // @ts-ignore
          return new Condition(this.condition[this.operator]).resolve(jsonValue, facts, operators);
        case ConditionOperatorsEnum.ANY:
          // @ts-ignore
          return (this.condition[this.operator] as IFactCondition[]).map((c: IFactCondition) => new Condition(c).resolve(jsonValue, facts, operators)).some(output => output);
        case ConditionOperatorsEnum.AND:
          // @ts-ignore
          return (this.condition[this.operator] as IFactCondition[]).map((c: IFactCondition) => new Condition(c).resolve(jsonValue, facts, operators)).every(output => output);
      }
    } else {
      const conditionFact = this.condition as IFactCondition;
      const fact: IFact | undefined = facts.get(conditionFact.fact);
      if (!fact) {
        throw new Error(`Condition: ${conditionFact.fact} not found`);
      }
      const operator = operators.get(`${fact.type}.${conditionFact.operator}`);
      if (!operator) {
        throw new Error(`Condition: ${conditionFact.operator} not found`);
      }
      return operator.evaluate(jsonValue[fact.name], conditionFact.value, conditionFact.params);
    }
  }
}
