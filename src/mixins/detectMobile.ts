const detectMobile = {
  methods: {
    isMobile: function (): boolean {
      const check = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      return check;
    }
  }
};

export default detectMobile;
