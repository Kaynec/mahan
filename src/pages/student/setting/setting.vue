<template>
  <div class="desktop" v-if="!isMobile.value"></div>
  <div v-else class="w-100 setting">
    <Header />
    <MinimalHeader title="تنظیمات" onePageBack="Home" />
    <!-- Main Content -->
    <div
      class="w-100 d-flex justify-content-center align-items-center flex-column p-2 animate__animated animate__fadeIn"
    >
      <!--  TextDetail="۲۲ آزمون برای رقابت"  -->
      <!-- Exams -->
      <Card label="آزمون جامع" iconSrc="test" componentName="compTest" />
      <Card
        label=" تقویم آموزشی"
        TextDetail="رویدادها و وقایع مهم را ثبت کنید"
        iconSrc="calendar"
        componentName="Calendar"
      />

      <!-- TextDetail="۴ پیام خوانده نشده دارید" -->
      <Card
        label="ارتباط با پشتیبان"
        iconSrc="support"
        componentName="ContactBackup"
      />
      <Card
        label="پروفایل"
        TextDetail="تکمیل اطلاعات حساب کاربری را انجام دهید"
        iconSrc="profile"
        componentName="MyProfile"
      />
      <Card
        label="ارتباط با ما"
        TextDetail="کافیست ماهانی شوید"
        iconSrc="contact-us"
        componentName="contactUs"
      />
      <Card
        label="محصولات آموزشی"
        TextDetail="کتابها و پادکست های جدید"
        iconSrc="education"
        componentName="studentShop"
      />

      <!-- TextDetail="۳۸ درصد از مسیر تا رسیدن به مقصد مانده!" -->
      <Card
        label="نقشه راه شما"
        iconSrc="roadmap"
        componentName="StudentGroupPage"
      />
    </div>
    <!--  -->
    <Footer />
  </div>
</template>

<script setup>
import Footer from '@/modules/student-modules/footer/footer.vue';
import Header from '@/modules/student-modules/header/header.vue';
import Card from '@/modules/student-modules/card.vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
</script>
<style lang="scss" scoped>
.setting {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f4f4f4;
  font-family: IRANSans;
}
</style>
