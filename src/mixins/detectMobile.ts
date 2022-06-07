import { ref } from 'vue';
// import { useBreakpoints } from '@vueuse/core';

// const breakpoints = useBreakpoints({
//   tablet: 640,
//   laptop: 1024,
//   desktop: 1280
// });

// const laptop = breakpoints.between('laptop', 'desktop');

// export const isMobile = breakpoints.isSmaller('tablet');

// window.onresize = () => {
//   console.log(breakpoints.isSmaller('tablet'));
// };

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
const breakpoints = useBreakpoints(breakpointsTailwind);
//
const sm = breakpoints.smaller('sm');
const md = breakpoints.between('sm', 'md');
const lg = breakpoints.between('md', 'lg');
const xl = breakpoints.between('lg', 'xl');
const xxl = breakpoints.between('xl', '2xl');
const xxxl = breakpoints['2xl'];

// const isMobile = breakpoints.smaller('md')

const isMobile = ref(breakpoints.smaller('md'));

export { breakpoints, isMobile, sm, md, lg, xl, xxl, xxxl };
