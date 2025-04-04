import Operator from './operator.js';
import Operators from './engine-operators.js';
import type {EvaluationCallback} from './_models/evaluation-callback.type.js';
import {FactTypesEnum} from './_enums/fact-types.enum.js';


export default class OperatorMap {
  operators: Map<string, Operator>;

  constructor () {
    this.operators = new Map();
    Operators.forEach(operator => this.addOperator(operator));
  }

  /**
   * Add a custom operator definition
   * @param {string}   operatorOrName - operator identifier within the condition; i.e. instead of 'equals', 'greaterThan', etc
   * @param {EvaluationCallback} callback - the method to execute when the operator is encountered.
   */
  addOperator (operatorOrName: Operator | string, callback?: EvaluationCallback) {
    let operator: Operator;
    if (operatorOrName instanceof Operator) {
      operator = operatorOrName;
    } else {
      operator = new Operator(operatorOrName, FactTypesEnum.custom, callback);
    }
    this.operators.set(operator.name, operator);
  }

  /**
   * Remove a custom operator definition
   * @param {Operator | string}   operatorOrName - operator identifier within the condition; i.e. instead of 'equals', 'greaterThan', etc
   */
  removeOperator (operatorOrName: Operator | string) {
    let operatorName: string;
    if (operatorOrName instanceof Operator) {
      operatorName = operatorOrName.name;
    } else {
      operatorName = operatorOrName;
    }
    return this.operators.delete(operatorName);
  }

  /**
   * Get the Operator, or null
   * @param {string} name - the name of the operator
   * @returns an operator or null
   */
  get (name: string): Operator | undefined {
    return this.operators.get(name);
  }
}
