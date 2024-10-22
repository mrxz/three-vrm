import type * as THREE from 'three';
import { VRMExpressionLoaderPlugin } from './expressions/VRMExpressionLoaderPlugin.js';
import { VRMFirstPersonLoaderPlugin } from './firstPerson/VRMFirstPersonLoaderPlugin.js';
import { VRMHumanoidLoaderPlugin } from './humanoid/VRMHumanoidLoaderPlugin.js';
import { VRMLookAtLoaderPlugin } from './lookAt/VRMLookAtLoaderPlugin.js';
import { VRMMetaLoaderPlugin } from './meta/VRMMetaLoaderPlugin.js';

export interface VRMCoreLoaderPluginOptions {
  expressionPlugin?: VRMExpressionLoaderPlugin;
  firstPersonPlugin?: VRMFirstPersonLoaderPlugin;
  humanoidPlugin?: VRMHumanoidLoaderPlugin;
  lookAtPlugin?: VRMLookAtLoaderPlugin;
  metaPlugin?: VRMMetaLoaderPlugin;

  /**
   * If assigned, the object will be used as a helper root of every component.
   * Useful for debug.
   * Will be overwritten if you use custom loader plugins for each components.
   */
  helperRoot?: THREE.Object3D;

  autoUpdateHumanBones?: boolean;
}
