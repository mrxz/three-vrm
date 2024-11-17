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

  // FIXME: Needs to be done on a 'per mesh' basis...
  const primitiveToMesh = new Map<THREE.Mesh, number>();

  // Collect all used morph targets
  const ctxs: Array<{
    primitives: THREE.Mesh[];
    usedMorphTargets: Record<number, VRMExpressionMorphTargetBind[]>;
    morphTargetRemapping: Record<number, number>;
  }> = [];

  vrm.expressionManager?.expressions.forEach((expression) => {
    // HACK: Iterate over binds of the expression (private/internal)
    ((expression as unknown as any)._binds as VRMExpressionBind[]).forEach((bind) => {
      if (bind instanceof VRMExpressionMorphTargetBind) {
        // Check which 'mesh' is referenced
        const mesh = bind.primitives[0];
        if (!primitiveToMesh.has(mesh)) {
          const meshId = ctxs.length;
          ctxs.push({
            primitives: bind.primitives,
            usedMorphTargets: {},
            morphTargetRemapping: {},
          });
          bind.primitives.forEach((prim) => primitiveToMesh.set(prim, meshId));
        }
        const { usedMorphTargets, morphTargetRemapping } = ctxs[primitiveToMesh.get(mesh)!];

        if (!usedMorphTargets[bind.index]) {
          usedMorphTargets[bind.index] = [];
          if (!(bind.index in morphTargetRemapping)) {
            morphTargetRemapping[bind.index] = Object.entries(morphTargetRemapping).length;
          }
        }
        usedMorphTargets[bind.index].push(bind);
      }
    });
  });

  // Update bindings
  for (const { usedMorphTargets, morphTargetRemapping } of ctxs) {
    for (const iMorph in usedMorphTargets) {
      for (const bind of usedMorphTargets[iMorph]) {
        (bind as any).index = morphTargetRemapping[bind.index];
      }
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

    // set to geometryMap
    geometryMap.set(geometry, geometry);

    // reduce morph attributes
    const newMorphAttributes: Record<string, THREE.BufferAttribute[]> = {};

    const ctx = ctxs[primitiveToMesh.get(mesh)!];
    if (ctx) {
      const { morphTargetRemapping } = ctx;

      Object.keys(geometry.morphAttributes).forEach((attributeName) => {
        newMorphAttributes[attributeName] = [];

        const morphs = geometry.morphAttributes[attributeName];
        for (const entry of Object.entries(morphTargetRemapping)) {
          const iMorph = +entry[0]; // FIXME: Avoid conversion
          const newIndex = entry[1];

          const originalAttribute = morphs[iMorph] as THREE.BufferAttribute;
          // HACK: The GLTFLoader does not store morph target names on the attributes, so pick them from the mesh instead.
          originalAttribute.name =
            Object.entries(mesh.morphTargetDictionary ?? {}).find((e) => e[1] === iMorph)?.[0] ?? '' + newIndex;
          newMorphAttributes[attributeName][newIndex] = originalAttribute;
        }
      });
    }

    mesh.geometry.morphAttributes = newMorphAttributes;
    mesh.updateMorphTargets();
  });
}
