import type { VRM0Meta } from './VRM0Meta.js';
import type { VRM1Meta } from './VRM1Meta.js';

/**
 * VRMMeta can be either {@link VRM0Meta} or {@link VRM1Meta}.
 */
export type VRMMeta = VRM0Meta | VRM1Meta;
