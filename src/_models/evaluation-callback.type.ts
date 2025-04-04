export type EvaluationCallback =  (factValue: any, jsonValue: any, params: (StringEvaluationParams | BooleanEvaluationParams | any)[] | DateEvaluationParams | any) => boolean;

export declare type StringEvaluationParams = 'caseSensitive' | 'notTrim';

export declare type BooleanEvaluationParams = 'ignoreNull';

export declare type Granularity = 'y' | 'M' | 'w' | 'd' | 'h' | 'm' | 's' | 'ms';

export declare type Round = 'ceil' | 'floor' | 'round' | 'float';

export interface DateEvaluationParams {
  granularity: Granularity;
  round: Round;
}

