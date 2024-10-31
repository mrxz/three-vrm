import type * as THREE from 'three';

export function traverseAncestorsFromRoot(object: THREE.Object3D, callback: (object: THREE.Object3D) => void): void {
  let ancestors: THREE.Object3D[] = object.userData.ancestors;

  if(!ancestors) {
    ancestors = [];

    let head: THREE.Object3D | null = object;
    while (head !== null) {
      ancestors.unshift(head);
      head = head.parent;
    }

    object.userData.ancestors = ancestors;
  }

  for(let i = 0; i < ancestors.length; i++) {
    callback(ancestors[i]);
  }
}
