import * as THREE from 'three';
import { VRM } from '../VRM.js';
import { VRMExpressionBind, VRMExpressionMorphTargetBind } from '@pixiv/three-vrm-core';

/**
 * Traverse given object and remove unnecessary morph targets from every BufferGeometries.
 *
 * @param root Root object that will be traversed
 * @param vrm Corresponding VRM avatar
 */
export function removeUnusedMorphTargets(root: THREE.Object3D, vrm: VRM): void {
  const geometryMap = new Map<THREE.BufferGeometry, THREE.BufferGeometry>();

  // Collect all used morph targets
  const usedMorphTargets: Record<number, VRMExpressionMorphTargetBind[]> = {};
  const morphTargetRemapping: Record<number, number> = {};

  vrm.expressionManager?.expressions.forEach(expression => {
    ((expression as any)._binds as VRMExpressionBind[]).forEach(bind => {
      if(bind instanceof VRMExpressionMorphTargetBind) {
        if(!usedMorphTargets[bind.index]) {
          usedMorphTargets[bind.index] = [];
          if(!(bind.index in morphTargetRemapping)) {
            morphTargetRemapping[bind.index] = Object.entries(morphTargetRemapping).length;
          }
        }
        usedMorphTargets[bind.index].push(bind);
      }
    });
  });

  // Update bindings
  for(const iMorph in usedMorphTargets) {
    for(const bind of usedMorphTargets[iMorph]) {
      (bind as any).index = morphTargetRemapping[bind.index];
    }
  }

  // Traverse an entire tree
  root.traverse((obj) => {
    if (!(obj as any).isMesh) {
      return;
    }

    const mesh = obj as THREE.Mesh;
    const geometry = mesh.geometry;

    // if the geometry does not have an index buffer it does not need to process
    const originalIndex = geometry.index;
    if (originalIndex == null) {
      return;
    }

    // skip already processed geometry
    const newGeometryAlreadyExisted = geometryMap.get(geometry);
    if (newGeometryAlreadyExisted != null) {
      mesh.geometry = newGeometryAlreadyExisted;
      mesh.updateMorphTargets();
      return;
    }

    const newGeometry = new THREE.BufferGeometry();

    // copy various properties
    // Ref: https://github.com/mrdoob/three.js/blob/1a241ef10048770d56e06d6cd6a64c76cc720f95/src/core/BufferGeometry.js#L1011
    newGeometry.name = geometry.name;

    newGeometry.morphTargetsRelative = geometry.morphTargetsRelative;

    geometry.groups.forEach((group) => {
      newGeometry.addGroup(group.start, group.count, group.materialIndex);
    });

    newGeometry.boundingBox = geometry.boundingBox?.clone() ?? null;
    newGeometry.boundingSphere = geometry.boundingSphere?.clone() ?? null;

    newGeometry.setDrawRange(geometry.drawRange.start, geometry.drawRange.count);

    newGeometry.userData = geometry.userData;

    newGeometry.setIndex(geometry.index);
    for(const attribute in geometry.attributes) {
      newGeometry.setAttribute(attribute, geometry.attributes[attribute]);
    }

    // set to geometryMap
    geometryMap.set(geometry, newGeometry);

    // reduce morph attributes
    Object.keys(geometry.morphAttributes).forEach((attributeName) => {
      newGeometry.morphAttributes[attributeName] = [];

      const morphs = geometry.morphAttributes[attributeName];
      for (const entry of Object.entries(morphTargetRemapping)) {
        const iMorph = +entry[0]; // FIXME: Avoid conversion
        const newIndex = entry[1];

        const originalAttribute = morphs[iMorph] as THREE.BufferAttribute;
        // HACK: The GLTFLoader does not store morph target names on the attributes, so pick them from the mesh instead.
        originalAttribute.name = Object.entries(mesh.morphTargetDictionary ?? {}).find(e => e[1] === iMorph)?.[0] ?? ('' + newIndex);
        newGeometry.morphAttributes[attributeName][newIndex] = originalAttribute;
      }
    });

    mesh.geometry = newGeometry;
    mesh.updateMorphTargets();
  });

  Array.from(geometryMap.keys()).forEach((originalGeometry) => {
    originalGeometry.dispose();
  });
}
