import type { BlendShape } from './BlendShape.js';
import type { FirstPerson } from './FirstPerson.js';
import type { Humanoid } from './Humanoid.js';
import type { Material } from './Material.js';
import type { Meta } from './Meta.js';
import type { SecondaryAnimation } from './SecondaryAnimation.js';

/**
 * VRM extension is for 3d humanoid avatars (and models) in VR applications.
 */
export interface VRM {
  /**
   * Version of exporter that vrm created. UniVRM-0.46
   */
  exporterVersion?: string;

  /**
   * Version of VRM specification. 0.0
   */
  specVersion?: '0.0';

  meta?: Meta;

  humanoid?: Humanoid;

  firstPerson?: FirstPerson;

  blendShapeMaster?: BlendShape;

  secondaryAnimation?: SecondaryAnimation;

  materialProperties?: Material[];
}
