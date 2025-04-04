import {FactTypesEnum} from '../_enums/fact-types.enum';

export interface IFact {
  name: string;
  type: FactTypesEnum;
  facts?: IFact[];
}
