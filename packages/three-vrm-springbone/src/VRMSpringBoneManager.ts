import type * as THREE from 'three';
import type { VRMSpringBoneJoint } from './VRMSpringBoneJoint.js';
import { traverseAncestorsFromRoot } from './utils/traverseAncestorsFromRoot.js';
import type { VRMSpringBoneCollider } from './VRMSpringBoneCollider.js';
import type { VRMSpringBoneColliderGroup } from './VRMSpringBoneColliderGroup.js';
import { traverseChildrenUntilConditionMet } from './utils/traverseChildrenUntilConditionMet.js';

export class VRMSpringBoneManager {
  private _joints = new Set<VRMSpringBoneJoint>();
  private _sortedJoints: Array<VRMSpringBoneJoint> = [];
  private _hasWarnedCircularDependency = false;

  public get joints(): Set<VRMSpringBoneJoint> {
    return this._joints;
  }

  /**
   * @deprecated Use {@link joints} instead.
   */
  public get springBones(): Set<VRMSpringBoneJoint> {
    console.warn('VRMSpringBoneManager: springBones is deprecated. use joints instead.');

    return this._joints;
  }

  public get colliderGroups(): VRMSpringBoneColliderGroup[] {
    const set = new Set<VRMSpringBoneColliderGroup>();
    this._joints.forEach((springBone) => {
      springBone.colliderGroups.forEach((colliderGroup) => {
        set.add(colliderGroup);
      });
    });
    return Array.from(set);
  }

  public get colliders(): VRMSpringBoneCollider[] {
    const set = new Set<VRMSpringBoneCollider>();
    this.colliderGroups.forEach((colliderGroup) => {
      colliderGroup.colliders.forEach((collider) => {
        set.add(collider);
      });
    });
    return Array.from(set);
  }

  private _objectSpringBonesMap = new Map<THREE.Object3D, Set<VRMSpringBoneJoint>>();

  public addJoint(joint: VRMSpringBoneJoint): void {
    this._joints.add(joint);

    let objectSet = this._objectSpringBonesMap.get(joint.bone);
    if (objectSet == null) {
      objectSet = new Set<VRMSpringBoneJoint>();
      this._objectSpringBonesMap.set(joint.bone, objectSet);
    }
    objectSet.add(joint);
    this._sortJoints();
  }

  /**
   * @deprecated Use {@link addJoint} instead.
   */
  public addSpringBone(joint: VRMSpringBoneJoint): void {
    console.warn('VRMSpringBoneManager: addSpringBone() is deprecated. use addJoint() instead.');

    this.addJoint(joint);
  }

  public deleteJoint(joint: VRMSpringBoneJoint): void {
    this._joints.delete(joint);

    const objectSet = this._objectSpringBonesMap.get(joint.bone)!;
    objectSet.delete(joint);
    this._sortJoints();
  }

  /**
   * @deprecated Use {@link deleteJoint} instead.
   */
  public deleteSpringBone(joint: VRMSpringBoneJoint): void {
    console.warn('VRMSpringBoneManager: deleteSpringBone() is deprecated. use deleteJoint() instead.');

    this.deleteJoint(joint);
  }

  /**
   * Sorts the joints ensuring they are updated in the correct order taking dependencies into account.
   */
  private _sortJoints() {
    const springBoneOrder: Array<VRMSpringBoneJoint> = [];
    const springBonesTried = new Set<VRMSpringBoneJoint>();
    const springBonesDone = new Set<VRMSpringBoneJoint>();
    for (const springBone of this._joints) {
      this._insertJointSort(springBone, springBonesTried, springBonesDone, springBoneOrder)
    }
    this._sortedJoints = springBoneOrder;
  }

  private _insertJointSort(
    springBone: VRMSpringBoneJoint,
    springBonesTried: Set<VRMSpringBoneJoint>,
    springBonesDone: Set<VRMSpringBoneJoint>,
    springBoneOrder: Array<VRMSpringBoneJoint>
  ) {
    if (springBonesDone.has(springBone)) {
      return;
    }

    if (springBonesTried.has(springBone)) {
      if (!this._hasWarnedCircularDependency) {
        console.warn('VRMSpringBoneManager: Circular dependency detected');
        this._hasWarnedCircularDependency = true; // FIXME: Reset whenever joints change
      }
      return;
    }

    const depObjects = springBone.dependencies;
    for (const depObject of depObjects) {
      traverseAncestorsFromRoot(depObject, (depObjectAncestor) => {
        const objectSet = this._objectSpringBonesMap.get(depObjectAncestor);
        if (objectSet) {
          for (const depSpringBone of objectSet) {
            this._insertJointSort(depSpringBone, springBonesTried, springBonesDone, springBoneOrder);
          }
        } else {
          // FIXME: Include non spring bone joints in the sequence to ensure matrix world is up-to-date
          //        in case of sparse spring bone chains.
          console.warn('Sparse spring bone chain detected, updates might be incorrect');
        }
      });
    }

    springBoneOrder.push(springBone);

    springBonesDone.add(springBone);
  }

  public setInitState(): void {
    for (let i = 0; i < this._sortedJoints.length; i++) {
      const springBone = this._sortedJoints[i];
      springBone.bone.updateMatrix();
      springBone.bone.updateWorldMatrix(false, false);
      springBone.setInitState();
    }
  }

  public reset(): void {
    for (let i = 0; i < this._sortedJoints.length; i++) {
      const springBone = this._sortedJoints[i];
      springBone.bone.updateMatrix();
      springBone.bone.updateWorldMatrix(false, false);
      springBone.reset();
    }
  }

  public update(delta: number): void {
    for (let i = 0; i < this._sortedJoints.length; i++) {
      // update the springbone
      const springBone = this._sortedJoints[i];
      springBone.bone.updateMatrix();
      springBone.bone.updateWorldMatrix(false, false);
      springBone.update(delta);

      // update children world matrices
      // it is required when the spring bone chain is sparse
      traverseChildrenUntilConditionMet(springBone.bone, (object) => {
        // if the object has attached springbone, halt the traversal
        if ((this._objectSpringBonesMap.get(object)?.size ?? 0) > 0) {
          return true;
        }

        // otherwise update its world matrix
        object.updateWorldMatrix(false, false);
        return false;
      });
    }
  }
}
