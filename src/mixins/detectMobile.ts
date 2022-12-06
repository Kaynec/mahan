import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
const breakpoints = useBreakpoints(breakpointsTailwind);

export const mobile = ref(breakpoints.smaller('md'));
