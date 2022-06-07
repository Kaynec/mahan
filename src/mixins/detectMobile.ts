import { useBreakpoints } from '@vueuse/core';

const breakpoints = useBreakpoints({
  tablet: 640,
  laptop: 1024,
  desktop: 1280
});

const laptop = breakpoints.between('laptop', 'desktop');

const detectMobile = {
  methods: {
    isMobile: function (): boolean {
      // const check = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      // return check;
      console.log(breakpoints.smaller('tablet').value);
      return breakpoints.smaller('tablet').value;
    }
  }
};

export default detectMobile;
