import type { Expression } from './Expression.js';
import type { ExpressionPresetName } from './ExpressionPresetName.js';

export interface Expressions {
  preset?: {
    [preset in ExpressionPresetName]?: Expression;
  };
  custom?: {
    [key: string]: Expression;
  };
}
