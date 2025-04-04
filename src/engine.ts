import Rule from './rule.js';
import OperatorMap from './operator-map.js';
import type {IRule} from './_models/rule.interface.js';
import Operators from './engine-operators.js';
import type Operator from './operator.js';
import type {IResult} from './_models/result.interface.js';
import type {EvaluationCallback} from './_models/evaluation-callback.type.js';

export class Engine {

  rule: Rule;
  operators = new OperatorMap();
  jsonValue: any;

  constructor(rule: IRule, jsonValue: any) {
    Operators.map((o: Operator) => this.addOperator(o));
    this.rule = new Rule(rule, this.operators);
    this.jsonValue = jsonValue;
  }

  addRule(rule: IRule) {
    return new Rule(rule, this.operators);
  }

  evaluate(): IResult[] {
    return this.rule.evaluate(this.jsonValue);
  }

  /**
   * Add a custom operator definition
   * @param {string}   operatorOrName - operator identifier within the condition; i.e. instead of 'equals', 'greaterThan', etc
   * @param {EvaluationCallback} callback - the method to execute when the operator is encountered.
   */
  addOperator (operatorOrName: Operator | string, callback?: EvaluationCallback) {
    this.operators.addOperator(operatorOrName, callback);
  }
}
