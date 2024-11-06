import { deduplicateSkeletons } from './deduplicateSkeletons.js';
import { deepDispose } from './deepDispose.js';
import { removeUnnecessaryJoints } from './removeUnnecessaryJoints.js';
import { removeUnnecessaryVertices } from './removeUnnecessaryVertices.js';
import { removeUnusedMorphTargets } from './removeUnusedMorphTargets.js';
import { rotateVRM0 } from './rotateVRM0.js';

export class VRMUtils {
  private constructor() {
    // this class is not meant to be instantiated
  }

  public static deduplicateSkeletons = deduplicateSkeletons;
  public static deepDispose = deepDispose;
  public static removeUnnecessaryJoints = removeUnnecessaryJoints;
  public static removeUnnecessaryVertices = removeUnnecessaryVertices;
  public static removeUnusedMorphTargets = removeUnusedMorphTargets;
  public static rotateVRM0 = rotateVRM0;
}
