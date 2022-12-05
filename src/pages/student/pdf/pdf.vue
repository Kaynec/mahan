<template>
  <Header />
  <MinimalHeader title="کتاب" v-if="isMobile.value" />
  <main class="book">
    <DesktopMinimalHeader v-if="!isMobile.value" />
    <canvas v-if="!isLoading" id="canvas"></canvas>
    <div class="loader-parent" v-if="isLoading">
      <div class="loading1"></div>
    </div>

    <div :class="{ mobile: isMobile.value }" class="controls">
      <i class="fas fa-fast-forward" @click="increase(allPages - 1)"></i>

      <div class="middle">
        <i class="fas fa-angle-right" @click="increase(1)"></i>

        <span>
          {{ toPersianNumbers(allPages) }} / {{ toPersianNumbers(pageNumber) }}
        </span>

        <i class="fas fa-angle-left" @click="decrease(1)"></i>
      </div>

      <i class="fas fa-fast-backward" @click="decrease(allPages - 1)"></i>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { baseUrl } from '@/api/apiclient';
import { useRoute } from 'vue-router';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { returnAProtectedUrl } from '@/utilities/get-image-from-url';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import Header from '@/modules/student-modules/header/header.vue';

export default defineComponent({
  components: { DesktopMinimalHeader, MinimalHeader, Header },
  setup() {
    const route = useRoute();
    // const pdfHref = route.params.filename;
    //

    const pdfUrl = (baseUrl + route.params.filename) as string;

    const isLoading = ref(true);
    const allPages = ref(0);
    const pageNumber = ref(1);
    let pdf;
    const increase = (amount) => {
      if (pageNumber.value + 1 > allPages.value) {
        return;
      }
      pageNumber.value += amount;
      renderPage(pageNumber.value);
    };
    const decrease = (amount) => {
      if (pageNumber.value - 1 < 1) {
        return;
      }
      pageNumber.value -= amount;

      renderPage(pageNumber.value);
    };

    returnAProtectedUrl(pdfUrl).then((res) => {
      isLoading.value = false;
      import('pdfjs-dist/legacy/build/pdf.min.js').then(async (pdfjsLib) => {
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js';

        // Asynchronous download of PDF
        pdfjsLib
          .getDocument({
            url: res,
            disableFontFace: true
          })
          .promise.then((pdf_) => {
            allPages.value = pdf_.numPages;
            pdf = pdf_;
            renderPage(1);
          });
      });
    });

    const renderPage = (pageNumber) => {
      pdf.getPage(pageNumber).then((page) => {
        const viewport = page.getViewport({ scale: 1.5 });

        // Prepare canvas using PDF page dimensions
        const canvas = document.getElementById('canvas') as any;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext as any);
      });
    };

    const jumpToPage = () => {
      renderPage(pageNumber.value);
    };

    return {
      isLoading,
      pageNumber,
      increase,
      decrease,
      allPages,
      jumpToPage,
      toPersianNumbers
    };
  }
});
</script>

<style lang="scss" scoped>
@import '@/css-variable//Global.scss';
.book {
  width: 100%;
  height: 100%;
  position: relative;
  max-width: 1000px;

  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
  padding-bottom: 3rem;

  .controls {
    width: 90vw;
    max-width: 450px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    background: linear-gradient(268deg, #ff545b 6%, #a50d14);
    color: #fff;
    border-radius: 15px;
    margin-bottom: 1.5rem;

    .middle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-basis: 30%;
    }

    i {
      transition: 0.3s ease;

      &:hover {
        cursor: pointer;
        transform: scale(1.08);
      }
    }
  }

  .page {
    position: relative;
    display: flex;
    background: #fff;
    margin-top: 8px;
    padding: 0.73rem 2rem;
    border-radius: 10px;
    overflow-y: auto;
    padding-bottom: 3rem;

    span {
      border-right: 2px solid #ddd;
      padding-right: 1rem;
    }

    input {
      flex-grow: 1;
      border: none;
    }
  }

  #canvas {
    width: 100vw;
    height: 80vh;
    max-height: 750px;
    max-width: 500px;
    margin: 0 auto;
  }
}
</style>
