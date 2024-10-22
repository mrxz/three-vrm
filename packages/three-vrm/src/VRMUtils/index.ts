import { deepDispose } from './deepDispose.js';
import { removeUnnecessaryJoints } from './removeUnnecessaryJoints.js';
import { removeUnnecessaryVertices } from './removeUnnecessaryVertices.js';
import { rotateVRM0 } from './rotateVRM0.js';

export class VRMUtils {
  private constructor() {
    // this class is not meant to be instantiated
  }

  public static deepDispose = deepDispose;
  public static removeUnnecessaryJoints = removeUnnecessaryJoints;
  public static removeUnnecessaryVertices = removeUnnecessaryVertices;
  public static rotateVRM0 = rotateVRM0;
}
