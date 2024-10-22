import type * as THREE from 'three';
import type { VRMFirstPersonMeshAnnotationType } from './VRMFirstPersonMeshAnnotationType.js';

export interface VRMFirstPersonMeshAnnotation {
  meshes: THREE.Mesh[];
  type: VRMFirstPersonMeshAnnotationType;
}
