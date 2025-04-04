import {FactTypesEnum} from './_enums/fact-types.enum.js';
import type {FactValueValidatorType} from './_models/fact-value-validator.type.js';
import type {EvaluationCallback} from './_models/evaluation-callback.type.js';

export default class Operator {
  name: string;
  type: FactTypesEnum;
  evaluationCallback: EvaluationCallback;
  factValueValidator: FactValueValidatorType;

  /**
   * Constructor
   * @param {string} name - operator identifier
   * @param {FactTypesEnum} type - type of fact for same name but different type
   * @param {EvaluationCallback} evaluationCallback - operator evaluation method
   * @param {(factValue: any) => boolean}  [factValueValidator] - optional validator for asserting the data type of the fact
   */
  constructor (name: string, type: FactTypesEnum, evaluationCallback?: EvaluationCallback, factValueValidator?: FactValueValidatorType) {
    if (!type) {
      throw new Error('Missing operator type');
    }
    this.type = type;
    if (!name) {
      throw new Error('Missing operator name');
    }
    this.name = `${type}.${name}`;
    if (typeof evaluationCallback !== 'function') { throw new Error('Missing operator callback'); }
    this.evaluationCallback = evaluationCallback;
    this.factValueValidator = factValueValidator || (() => true);
  }

  /**
   * Takes the fact result and compares it to the condition 'value', using the callback
   * @param   {any} factValue - fact result
   * @param   {any} jsonValue - "value" property of the condition
   * @param   {any} params - custom params, ex. caseSensitive for string
   * @returns {Boolean} - whether the values pass the operator test
   */
  evaluate (factValue: any, jsonValue: any, params?: any): boolean {
    return this.factValueValidator(factValue) && this.evaluationCallback(factValue, jsonValue, params);
  }
}
