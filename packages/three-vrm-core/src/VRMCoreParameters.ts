import type * as THREE from 'three';
import type { VRMExpressionManager } from './expressions/VRMExpressionManager.js';
import type { VRMFirstPerson } from './firstPerson/VRMFirstPerson.js';
import type { VRMHumanoid } from './humanoid/VRMHumanoid.js';
import type { VRMLookAt } from './lookAt/VRMLookAt.js';
import type { VRMMeta } from './meta/VRMMeta.js';

/**
 * Parameters for a {@link VRMCore} class.
 */
export interface VRMCoreParameters {
  scene: THREE.Group;
  meta: VRMMeta;
  humanoid: VRMHumanoid;
  expressionManager?: VRMExpressionManager;
  firstPerson?: VRMFirstPerson;
  lookAt?: VRMLookAt;
}
