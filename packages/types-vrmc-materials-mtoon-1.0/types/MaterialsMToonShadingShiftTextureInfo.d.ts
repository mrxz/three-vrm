import type { MaterialsMToonTextureInfo } from './MaterialsMToonTextureInfo.js';

export interface MaterialsMToonShadingShiftTextureInfo extends MaterialsMToonTextureInfo {
  /**
   * The scalar multiplier applied to the texture.
   */
  scale?: number;
}
