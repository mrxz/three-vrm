import { AimConstraint } from './AimConstraint.js';
import { RollConstraint } from './RollConstraint.js';
import type { RotationConstraint } from './RotationConstraint.js';

/**
 * An object contains one of constraints.
 */
export interface Constraint {
  roll?: RollConstraint;
  aim?: AimConstraint;
  rotation?: RotationConstraint;

  extensions?: { [name: string]: any };
  extras?: any;
}
