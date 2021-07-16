import * as THREE from 'three';
import { GLTF, GLTFLoaderPlugin, GLTFParser } from 'three/examples/jsm/loaders/GLTFLoader';
import {
  VRMExpressionLoaderPlugin,
  VRMFirstPersonLoaderPlugin,
  VRMHumanoidLoaderPlugin,
  VRMLookAtLoaderPlugin,
  VRMMetaLoaderPlugin,
} from '@pixiv/three-vrm-core';
import { MToonMaterialLoaderPlugin } from '@pixiv/three-vrm-materials-mtoon';
import { VRMMaterialsV0CompatPlugin } from '@pixiv/three-vrm-materials-v0compat';
import { VRMNodeConstraintLoaderPlugin } from '@pixiv/three-vrm-node-constraint';
import { VRMSpringBoneLoaderPlugin } from '@pixiv/three-vrm-springbone';
import { VRMLoaderPluginOptions } from './VRMLoaderPluginOptions';
import { VRM } from './VRM';

export class VRMLoaderPlugin implements GLTFLoaderPlugin {
  public readonly parser: GLTFParser;

  public readonly expressionPlugin: VRMExpressionLoaderPlugin;
  public readonly firstPersonPlugin: VRMFirstPersonLoaderPlugin;
  public readonly humanoidPlugin: VRMHumanoidLoaderPlugin;
  public readonly lookAtPlugin: VRMLookAtLoaderPlugin;
  public readonly metaPlugin: VRMMetaLoaderPlugin;
  public readonly mtoonMaterialPlugin: MToonMaterialLoaderPlugin;
  public readonly materialsV0CompatPlugin: VRMMaterialsV0CompatPlugin;
  public readonly springBonePlugin: VRMSpringBoneLoaderPlugin;
  public readonly constraintPlugin: VRMNodeConstraintLoaderPlugin;

  public constructor(parser: GLTFParser, options?: VRMLoaderPluginOptions) {
    this.parser = parser;

    const helperRoot = options?.helperRoot;

    this.expressionPlugin = options?.expressionPlugin ?? new VRMExpressionLoaderPlugin(parser);
    this.firstPersonPlugin = options?.firstPersonPlugin ?? new VRMFirstPersonLoaderPlugin(parser);
    this.humanoidPlugin = options?.humanoidPlugin ?? new VRMHumanoidLoaderPlugin(parser);
    this.lookAtPlugin = options?.lookAtPlugin ?? new VRMLookAtLoaderPlugin(parser);
    this.metaPlugin = options?.metaPlugin ?? new VRMMetaLoaderPlugin(parser);
    this.mtoonMaterialPlugin = options?.mtoonMaterialPlugin ?? new MToonMaterialLoaderPlugin(parser);
    this.materialsV0CompatPlugin = options?.materialsV0CompatPlugin ?? new VRMMaterialsV0CompatPlugin(parser);

    this.springBonePlugin =
      options?.springBonePlugin ??
      new VRMSpringBoneLoaderPlugin(parser, {
        colliderHelperRoot: helperRoot,
        jointHelperRoot: helperRoot,
      });

    this.constraintPlugin = options?.constraintPlugin ?? new VRMNodeConstraintLoaderPlugin(parser, { helperRoot });
  }

  public async beforeRoot(): Promise<void> {
    await this.materialsV0CompatPlugin.beforeRoot();
    await this.mtoonMaterialPlugin.beforeRoot();
  }

  public async loadMesh(meshIndex: number): Promise<THREE.Group | THREE.Mesh | THREE.SkinnedMesh> {
    return await this.mtoonMaterialPlugin.loadMesh(meshIndex);
  }

  public getMaterialType(materialIndex: number): typeof THREE.Material | null {
    const mtoonType = this.mtoonMaterialPlugin.getMaterialType(materialIndex);
    if (mtoonType != null) {
      return mtoonType;
    }

    return null;
  }

  public async extendMaterialParams(materialIndex: number, materialParams: { [key: string]: any }): Promise<any> {
    await this.mtoonMaterialPlugin.extendMaterialParams(materialIndex, materialParams);
  }

  public async afterRoot(gltf: GLTF): Promise<void> {
    await this.metaPlugin.afterRoot(gltf);
    await this.humanoidPlugin.afterRoot(gltf);
    await this.expressionPlugin.afterRoot(gltf);
    await this.lookAtPlugin.afterRoot(gltf);
    await this.firstPersonPlugin.afterRoot(gltf);
    await this.springBonePlugin.afterRoot(gltf);
    await this.constraintPlugin.afterRoot(gltf);
    await this.mtoonMaterialPlugin.afterRoot(gltf);

    const vrm = new VRM({
      scene: gltf.scene,
      expressionManager: gltf.userData.vrmExpressionManager,
      firstPerson: gltf.userData.vrmFirstPerson,
      humanoid: gltf.userData.vrmHumanoid,
      lookAt: gltf.userData.vrmLookAt,
      meta: gltf.userData.vrmMeta,
      materials: gltf.userData.vrmMToonMaterials,
      springBoneManager: gltf.userData.vrmSpringBoneManager,
      constraintManager: gltf.userData.vrmConstraintManager,
    });
    gltf.userData.vrm = vrm;
  }
}
