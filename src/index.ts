import {Engine} from './engine.js';

export default function (rules: any, options: any) {
  return new Engine(rules, options)
}
