import type {FactTypesEnum} from '../_enums/fact-types.enum.js';

export interface IFact {
  name: string;
  type: FactTypesEnum;
  facts?: IFact[];
}
