import * as THREE from 'three';

/**
 * Traverse the given object and .
 *
 * Some environments like mobile devices have a lower limit of bones
 * and might be unable to perform mesh skinning with many bones.
 * This function might resolve such an issue.
 *
 * Also, this function might significantly improve the performance of mesh skinning.
 *
 * @param root Root object that will be traversed
 */
export function deduplicateSkeletons(
  root: THREE.Object3D
): void {
  const skeletons: Array<THREE.Skeleton> = [];
  const skinnedMeshesPerSkeleton: WeakMap<THREE.Skeleton, Array<THREE.SkinnedMesh>> = new WeakMap();

  root.traverse((obj) => {
    if (obj.type !== 'SkinnedMesh') {
      return;
    }

    const skinnedMesh = obj as THREE.SkinnedMesh;
    const skeleton = skinnedMesh.skeleton;
    const matchingSkeleton = skeletons.find(s => s.bones.every((bone, i) => bone === skeleton.bones?.[i]));
    if(matchingSkeleton) {
        skinnedMesh.bind(matchingSkeleton, new THREE.Matrix4());
        skinnedMeshesPerSkeleton.get(matchingSkeleton)!.push(skinnedMesh);
    } else {
        skeletons.push(skeleton);
        skinnedMeshesPerSkeleton.set(skeleton, [skinnedMesh]);
    }
  });

  // Remove any unnecessary joints
  for(const skeleton of skeletons) {
    const bones: THREE.Bone[] = []; // new list of bone
    const boneInverses: THREE.Matrix4[] = []; // new list of boneInverse
    const boneIndexMap: { [index: number]: number } = {}; // map of old bone index vs. new bone index

    for(const mesh of skinnedMeshesPerSkeleton.get(skeleton)!) {
        const geometry = mesh.geometry;
        const attribute = geometry.getAttribute('skinIndex') as THREE.BufferAttribute;

        const array = attribute.array;
        for (let i = 0; i < array.length; i++) {
            const index = array[i];

            // new skinIndex buffer
            if (boneIndexMap[index] == null) {
                boneIndexMap[index] = bones.length;
                bones.push(mesh.skeleton.bones[index]);
                boneInverses.push(mesh.skeleton.boneInverses[index]);
            }

            array[i] = boneIndexMap[index];
        }

        // replace with new indices
        attribute.copyArray(array);
        attribute.needsUpdate = true;
    }

    // Update the skeleton
    const newSkeleton = new THREE.Skeleton(bones, boneInverses);
    for(const mesh of skinnedMeshesPerSkeleton.get(skeleton)!) {
        mesh.bind(newSkeleton, new THREE.Matrix4());
    }
  }
}
