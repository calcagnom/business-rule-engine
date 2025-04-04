import type {ConditionOperatorsEnum} from '../_enums/condition-operators.enum.js';
import {
  ArrayConditions,
  BooleanConditions,
  DateConditions,
  type NumberConditions, ObjectConditions,
  StringConditions
} from '../_enums/fact-operators.enum.js';


export type ICondition = {
  [index in ConditionOperatorsEnum]: (IFactCondition | ICondition)[];
};

export interface IFactCondition {
  fact: string;
  operator: NumberConditions | StringConditions | DateConditions | BooleanConditions | ArrayConditions | ObjectConditions;
  value: any;
  params?: string;
}

