import type * as THREE from 'three';

/**
 * Traverse children of given object and execute given callback.
 * The given object itself wont be given to the callback.
 * If the return value of the callback is `true`, it will halt the traversal of its children.
 * @param object A root object
 * @param callback A callback function called for each children
 */
export function traverseChildrenUntilConditionMet(
  object: THREE.Object3D,
  callback: (object: THREE.Object3D) => boolean,
): void {
  for(let i = 0; i < object.children.length; i++) {
    const child = object.children[i];
    const result = callback(child);
    if (!result) {
      traverseChildrenUntilConditionMet(child, callback);
    }
  }
}
