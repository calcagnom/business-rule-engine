import type {IFact} from './_models/fact.interface.js';

export default class FactMap {
  facts: Map<string, IFact>;

  constructor(facts: IFact[]) {
    this.facts = new Map();
    facts.forEach(fact => this.addFact(fact));
  }

  /**
   * Add a custom operator definition
   * @param {IFact}   fact
   */
  addFact(fact: IFact) {
    this.facts.set(fact.name, fact);
  }

  /**
   * Get the Fact, or undefined
   * @param {string} name - the name of the fact
   * @returns an Fact or undefined
   */
  get(name: string): IFact | undefined {
    return this.facts.get(name);
  }
}
