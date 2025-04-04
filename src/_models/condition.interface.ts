import {ConditionOperatorsEnum} from '../_enums/condition-operators.enum';
import {
  ArrayConditions,
  BooleanConditions,
  DateConditions,
  NumberConditions, ObjectConditions,
  StringConditions
} from '../_enums/fact-operators.enum';

export type ICondition = {
  [index in ConditionOperatorsEnum]: (IFactCondition | ICondition)[];
};

export interface IFactCondition {
  fact: string;
  operator: NumberConditions | StringConditions | DateConditions | BooleanConditions | ArrayConditions | ObjectConditions;
  value: any;
  params?: string;
}

