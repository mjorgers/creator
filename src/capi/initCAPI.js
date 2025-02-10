import { CAPI_MEMORY } from './capi_memory';
import { CAPI_SYSCALL } from './capi_syscall';
import { CAPI_VALIDATION } from './capi_validation';
import { CAPI_CHECK_STACK } from './capi_check_stack';
import { CAPI_DRAW_STACK } from './capi_draw_stack';
import { CAPI_FP} from './capi_fp';
// import { CAPI_STACK } from './stack';
// import { CAPI_TYPES } from './types';

// Export all CAPI functions and make them globally available
export function initCAPI() {
  const CAPI = {
    ...CAPI_MEMORY,
    ...CAPI_SYSCALL, 
    ...CAPI_VALIDATION,
    ...CAPI_CHECK_STACK,
    ...CAPI_DRAW_STACK,
    ...CAPI_FP
  };

  // Make functions globally available for eval
  if (typeof window !== 'undefined') {
    Object.entries(CAPI).forEach(([key, value]) => {
      window[`capi_${key}`] = value;
    });
  } else {
    Object.entries(CAPI).forEach(([key, value]) => {
      global[`capi_${key}`] = value; 
    });
  }

  return CAPI;
}