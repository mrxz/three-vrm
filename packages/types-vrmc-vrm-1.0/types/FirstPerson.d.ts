import type { FirstPersonMeshAnnotation } from './FirstPersonMeshAnnotation.js';

/**
 * First-person perspective settings
 */
export interface FirstPerson {
  /**
   * Mesh rendering annotation for cameras
   */
  meshAnnotations?: FirstPersonMeshAnnotation[];

  extensions?: { [name: string]: any };
  extras?: any;
}
