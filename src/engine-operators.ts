import Operator from './operator.js';
import type {FactValueValidatorType} from './_models/fact-value-validator.type.js';
import {
  ArrayConditions,
  BooleanConditions,
  DateConditions,
  NumberConditions, ObjectConditions,
  StringConditions
} from './_enums/fact-operators.enum.js';
import {FactTypesEnum} from './_enums/fact-types.enum.js';
import type {
  BooleanEvaluationParams,
  DateEvaluationParams,
  Granularity,
  StringEvaluationParams
} from './_models/evaluation-callback.type.js';

const Operators: Operator[] = [];
//#region Numbers Operators
const numberValidator: FactValueValidatorType = (factValue: any) => Number.parseFloat(factValue).toString() !== 'NaN';

Operators.push(new Operator(NumberConditions.equals, FactTypesEnum.number, (a: number, b: number) => a === b, numberValidator));
Operators.push(new Operator(NumberConditions.notEqual, FactTypesEnum.number, (a: number, b: number) => a !== b, numberValidator));
Operators.push(new Operator(NumberConditions.lessThan, FactTypesEnum.number, (a: number, b: number) => a < b, numberValidator));
Operators.push(new Operator(NumberConditions.lessThanOrEqual, FactTypesEnum.number, (a: number, b: number) => a <= b, numberValidator));
Operators.push(new Operator(NumberConditions.greaterThan, FactTypesEnum.number, (a: number, b: number) => a > b, numberValidator));
Operators.push(new Operator(NumberConditions.greaterThanOrEqual, FactTypesEnum.number, (a: number, b: number) => a >= b, numberValidator));
Operators.push(new Operator(NumberConditions.inRange, FactTypesEnum.number, (a: number, b: [number, number]) => a <= Math.max(...b) && a >= Math.min(...b), numberValidator));
Operators.push(new Operator(NumberConditions.isNull, FactTypesEnum.number, (a: number) => a === null || a === undefined)); // numberValidator will return false for null or undefined
Operators.push(new Operator(NumberConditions.isNotNull, FactTypesEnum.number, (a: number) => a !== null && a !== undefined, numberValidator));
Operators.push(new Operator(NumberConditions.in, FactTypesEnum.number, (a: number, b: number[]) => b.includes(a), numberValidator));
Operators.push(new Operator(NumberConditions.notIn, FactTypesEnum.number, (a: number, b: number[]) => !b.includes(a), numberValidator));
//#endregion

//#region String Operators
const getStringValueForCompare = (value: string, params: StringEvaluationParams[]): string => {
  if (!value) {
    return '';
  }
  if (!params?.includes('caseSensitive')) {
    value = value.toLowerCase();
  }
  if (!params?.includes('notTrim')) {
    value = value.trim();
  }
  return value;
};

Operators.push(new Operator(StringConditions.equals, FactTypesEnum.string, (a: string, b: string, params: StringEvaluationParams[]) => getStringValueForCompare(a, params) === getStringValueForCompare(b, params)));
Operators.push(new Operator(StringConditions.notEqual, FactTypesEnum.string, (a: string, b: string, params: StringEvaluationParams[]) => getStringValueForCompare(a, params) !== getStringValueForCompare(b, params)));
Operators.push(new Operator(StringConditions.contains, FactTypesEnum.string, (a: string, b: string, params: StringEvaluationParams[]) => getStringValueForCompare(a, params).includes(getStringValueForCompare(b, params))));
Operators.push(new Operator(StringConditions.notContains, FactTypesEnum.string, (a: string, b: string, params: StringEvaluationParams[]) => !getStringValueForCompare(a, params).includes(getStringValueForCompare(b, params))));
Operators.push(new Operator(StringConditions.startsWith, FactTypesEnum.string, (a: string, b: string, params: StringEvaluationParams[]) => getStringValueForCompare(a, params).startsWith(getStringValueForCompare(b, params))));
Operators.push(new Operator(StringConditions.notStartsWith, FactTypesEnum.string, (a: string, b: string, params: StringEvaluationParams[]) => !getStringValueForCompare(a, params).startsWith(getStringValueForCompare(b, params))));
Operators.push(new Operator(StringConditions.endsWith, FactTypesEnum.string, (a: string, b: string, params: StringEvaluationParams[]) => getStringValueForCompare(a, params).endsWith(getStringValueForCompare(b, params))));
Operators.push(new Operator(StringConditions.notEndsWith, FactTypesEnum.string, (a: string, b: string, params: StringEvaluationParams[]) => !getStringValueForCompare(a, params).endsWith(getStringValueForCompare(b, params))));
Operators.push(new Operator(StringConditions.isNotNullNorWhiteSpace, FactTypesEnum.string, (a: string) => !!a));
Operators.push(new Operator(StringConditions.isNotNull, FactTypesEnum.string, (a: string) => a !== null && a !== undefined));
Operators.push(new Operator(StringConditions.isNull, FactTypesEnum.string, (a: string) => a === null || a === undefined));
Operators.push(new Operator(StringConditions.isNullOrWhiteSpace, FactTypesEnum.string, (a: string) => !a));
Operators.push(new Operator(StringConditions.in, FactTypesEnum.string, (a: string, b: string[]) => b.includes(a)));
Operators.push(new Operator(StringConditions.notIn, FactTypesEnum.string, (a: string, b: string[]) => !b.includes(a)));
Operators.push(new Operator(StringConditions.minLength, FactTypesEnum.string, (a: string, b: number) => getStringValueForCompare(a, []).length >= b));
Operators.push(new Operator(StringConditions.maxLength, FactTypesEnum.string, (a: string, b: number) => getStringValueForCompare(a, []).length <= b));
//#endregion

//#region Date Operators
declare type DateOperator = 'isSame' | 'isBefore' | 'isAfter' | 'isSameOrBefore' | 'isSameOrAfter';

const isDateValid = (date: Date | string | number) => {
  if (typeof date === 'string' && date === 'now') {
    return true;
  }
  return !isNaN(new Date(date).getTime());
};

function compareDates({from, to, operation = 'isSame', granularity = 'ms'}: {from: Date | string | number, to: Date | string | number, operation?: DateOperator, granularity?: Granularity}): boolean {
  const valueDate = getDateByGranularity(from, granularity);
  const checkDate = getDateByGranularity(to, granularity);
  switch (operation) {
    case 'isSame':
      return isSame(valueDate, checkDate);
    case 'isAfter':
      return isAfter(valueDate, checkDate);
    case 'isBefore':
      return isBefore(valueDate, checkDate);
    case 'isSameOrAfter':
      return isSame(valueDate, checkDate) || isAfter(valueDate, checkDate);
    case 'isSameOrBefore':
      return isSame(valueDate, checkDate) || isBefore(valueDate, checkDate);
  }
}

function getDateByGranularity(date: Date | string | number, granularity: Granularity = 's'): Date {
  let valueDate = new Date(date);
  if (typeof date === 'string' && date === 'now') {
    valueDate = new Date();
  }
  switch (granularity) {
    case 'y':
      // set same month
      valueDate.setMonth(0);
      // set day - hour - minutes - seconds - ms to zero
      valueDate = getDateByGranularity(valueDate, 'd');
      break;
    case 'M':
      // set same day
      valueDate.setDate(0);
      // set day - hour - minutes - seconds - ms to zero
      valueDate = getDateByGranularity(valueDate, 'd');
      break;
    case 'd':
      valueDate.setHours(0, 0, 0, 0);
      break;
    case 'h':
      valueDate.setMinutes(0, 0, 0);
      break;
    case 'm':
      valueDate.setSeconds(0, 0);
      break;
    case 's':
      valueDate.setMilliseconds(0);
      break;
  }
  return valueDate;
}

function isSame(from: Date, to: Date) {
  return from.getTime() === to.getTime();
}

function isAfter(from: Date, to: Date) {
  return from.getTime() > to.getTime();
}

function isBefore(from: Date, to: Date) {
  return from.getTime() < to.getTime();
}

Operators.push(new Operator(DateConditions.equals, FactTypesEnum.date, (a: Date | string | number, b: Date | string | number, params: DateEvaluationParams) => compareDates({from: a, to: b, operation: 'isSame', granularity: params?.granularity}), isDateValid));
Operators.push(new Operator(DateConditions.notEqual, FactTypesEnum.date, (a: Date | string | number, b: Date | string | number, params: DateEvaluationParams) => !compareDates({from: a, to: b, operation: 'isSame', granularity: params?.granularity}), isDateValid));
Operators.push(new Operator(DateConditions.lessThan, FactTypesEnum.date, (a: Date | string | number, b: Date | string | number, params: DateEvaluationParams) => compareDates({from: a, to: b, operation: 'isBefore', granularity: params?.granularity}), isDateValid));
Operators.push(new Operator(DateConditions.lessThanOrEqual, FactTypesEnum.date, (a: Date | string | number, b: Date | string | number, params: DateEvaluationParams) => compareDates({from: a, to: b, operation: 'isSameOrBefore', granularity: params?.granularity}), isDateValid));
Operators.push(new Operator(DateConditions.greaterThan, FactTypesEnum.date, (a: Date | string | number, b: Date | string | number, params: DateEvaluationParams) => compareDates({from: a, to: b, operation: 'isAfter', granularity: params?.granularity}), isDateValid));
Operators.push(new Operator(DateConditions.greaterThanOrEqual, FactTypesEnum.date, (a: Date | string | number, b: Date | string | number, params: DateEvaluationParams) => compareDates({from: a, to: b, operation: 'isSameOrAfter', granularity: params?.granularity}), isDateValid));
// tslint:disable-next-line:max-line-length
Operators.push(new Operator(DateConditions.inRange, FactTypesEnum.date, (a: Date | string | number, b: [Date | string | number, Date | string | number], params: DateEvaluationParams) => compareDates({from: a, to: Math.max(...b.map(d => new Date(d).getTime())), operation: 'isSameOrBefore', granularity: params?.granularity}) && compareDates({from: a, to: Math.min(...b.map(d => new Date(d).getTime())), operation: 'isSameOrAfter', granularity: params?.granularity}), isDateValid));
Operators.push(new Operator(DateConditions.isNull, FactTypesEnum.date, (a: Date | string | number) => a === null || a === undefined)); // numberValidator will return false for null or undefined
Operators.push(new Operator(DateConditions.isNotNull, FactTypesEnum.date, (a: Date | string | number) => a !== null && a !== undefined, isDateValid));
//#endregion

//#region Boolean Operators
const getBoolValueForCompare = (value: boolean, operatorType: BooleanConditions, params: BooleanEvaluationParams[]): boolean => {
  if (!params?.includes('ignoreNull')) {
    value = !!value;
  }
  return operatorType === BooleanConditions.isTrue ? value : !value;
};


Operators.push(new Operator(BooleanConditions.isTrue, FactTypesEnum.boolean, (a: boolean, b: string, params: BooleanEvaluationParams[]) => getBoolValueForCompare(a, BooleanConditions.isTrue, params)));
Operators.push(new Operator(BooleanConditions.isFalse, FactTypesEnum.boolean, (a: boolean, b: string, params: BooleanEvaluationParams[]) => getBoolValueForCompare(a, BooleanConditions.isFalse, params)));
//#endregion

//#region Array Operators
Operators.push(new Operator(ArrayConditions.empty, FactTypesEnum.array, (a: any[]) => a.length === 0, (a: any) => Array.isArray(a)));
Operators.push(new Operator(ArrayConditions.notEmpty, FactTypesEnum.array, (a: any[]) => a.length !== 0, (a: any) => Array.isArray(a)));
Operators.push(new Operator(ArrayConditions.contains, FactTypesEnum.array, (a: any[], b: any) => a.includes(b), (a: any) => Array.isArray(a)));
Operators.push(new Operator(ArrayConditions.notContains, FactTypesEnum.array, (a: any[], b: any) => !a.includes(b), (a: any) => Array.isArray(a)));
Operators.push(new Operator(ArrayConditions.startsWith, FactTypesEnum.array, (a: any[], b: any) => a[0] === b, (a: any) => Array.isArray(a)));
Operators.push(new Operator(ArrayConditions.notStartsWith, FactTypesEnum.array, (a: any[], b: any) => a[0] !== b, (a: any) => Array.isArray(a)));
Operators.push(new Operator(ArrayConditions.endsWith, FactTypesEnum.array, (a: any[], b: any) => a[a.length - 1] === b, (a: any) => Array.isArray(a)));
Operators.push(new Operator(ArrayConditions.notEndsWith, FactTypesEnum.array, (a: any[], b: any) => a[a.length - 1] !== b, (a: any) => Array.isArray(a)));
Operators.push(new Operator(ArrayConditions.minLength, FactTypesEnum.array, (a: any[], b: number) => a.length >= b, (a: any) => Array.isArray(a)));
Operators.push(new Operator(ArrayConditions.maxLength, FactTypesEnum.array, (a: any[], b: number) => a.length <= b, (a: any) => Array.isArray(a)));
//#endregion

//#region Object Operators
Operators.push(new Operator(ObjectConditions.isNotNull, FactTypesEnum.object, (a: any) => a !== null && a !== undefined && Object.values(a).length > 0, (a: any) => typeof a === 'object'));
Operators.push(new Operator(ObjectConditions.isNull, FactTypesEnum.object, (a: any) => a === null || a === undefined || Object.values(a).length === 0, (a: any) => typeof a === 'object'));
//#endregion

export default Operators;
