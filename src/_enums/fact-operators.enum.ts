export enum NumberConditions {
  equals = 'equals',
  notEqual = 'notEqual',
  lessThan = 'lessThan',
  lessThanOrEqual = 'lessThanOrEqual',
  greaterThan = 'greaterThan',
  greaterThanOrEqual = 'greaterThanOrEqual',
  inRange = 'inRange',
  isNotNull = 'isNotNull',
  isNull = 'isNull',
  in = 'in',
  notIn = 'notIn',
}

export enum StringConditions {
  equals = 'equals',
  notEqual = 'notEqual',
  contains = 'contains',
  notContains = 'notContains',
  startsWith = 'startsWith',
  notStartsWith = 'notStartsWith',
  endsWith = 'endsWith',
  notEndsWith = 'endsWith',
  isNotNullNorWhiteSpace = 'isNotNullNorWhiteSpace',
  isNotNull = 'isNotNull',
  isNull = 'isNull',
  isNullOrWhiteSpace = 'isNullOrWhiteSpace',
  in = 'in',
  notIn = 'notIn',
  minLength = 'minLength',
  maxLength = 'maxLength',
}

export enum DateConditions {
  equals = 'equals',
  notEqual = 'notEqual',
  lessThan = 'lessThan',
  lessThanOrEqual = 'lessThanOrEqual',
  greaterThan = 'greaterThan',
  greaterThanOrEqual = 'greaterThanOrEqual',
  inRange = 'inRange',
  isNotNull = 'isNotNull',
  isNull = 'isNull',
}

export enum BooleanConditions {
  isTrue = 'isTrue',
  isFalse = 'isFalse',
}

export enum ArrayConditions {
  empty = 'empty',
  notEmpty = 'notEmpty',
  contains = 'contains',
  notContains = 'notContains',
  startsWith = 'startsWith',
  notStartsWith = 'notStartsWith',
  endsWith = 'endsWith',
  notEndsWith = 'endsWith',
  minLength = 'minLength',
  maxLength = 'maxLength',
  // TODO: implement condition
  condition = 'condition'
}

export enum ObjectConditions {
  isNotNull = 'isNotNull',
  isNull = 'isNull',
  // TODO: implement condition
  condition = 'condition'
}
