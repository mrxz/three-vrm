import * as THREE from 'three';
import { VRM } from '../VRM.js';
import { VRMSpringBoneJoint } from 'packages/three-vrm-springbone/types/VRMSpringBoneJoint.js';

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
  root: THREE.Object3D,
  vrm: VRM
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
  const allBones = new Set<THREE.Bone>();
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

                allBones.add(mesh.skeleton.bones[index]);
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

  // Determine useless nodes
  const markedForDeletion: THREE.Object3D[] = [];
  root.traverse(c => {
    if(!isRelevant(c, allBones)) {
      markedForDeletion.push(c);
    }
  });
  markedForDeletion.forEach(c => c.removeFromParent());
  // Cleanup corresponding VRM constructs
  const jointsMarkedForDeletion: VRMSpringBoneJoint[] = [];
  for(const joint of vrm.springBoneManager?.joints ?? []) {
    if(joint.bone.parent === null) {
      jointsMarkedForDeletion.push(joint);
    }
  }
  jointsMarkedForDeletion.forEach(joint => vrm.springBoneManager?.deleteJoint(joint));
}

function isRelevant(node: THREE.Object3D, bones: Set<THREE.Bone>): boolean {
  if((node as THREE.Mesh).isMesh) {
    return true;
  }

  if((node as THREE.Bone).isBone) {
    if (bones.has(node as THREE.Bone)) {
      return true;
    }
  }

  // VRMSpringBoneCollider
  if('shape' in node) {
    return true;
  }

  const relevantChildren = node.children.some(child => isRelevant(child, bones));
  if(relevantChildren) {
    return true;
  }

  return false;
}
