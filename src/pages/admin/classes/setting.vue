<template>
  <!-- Content Header (Page header) -->
  <div class="content-header">
    <div class="container-fluid">
      <div class="row mb-2">
        <div class="col-sm-6">
          <h1 class="m-0">عملیات کلاس</h1>
        </div>
        <!-- /.col -->
        <!-- <div class="col-sm-6">
                <ol class="breadcrumb float-sm-left">
                    <li class="breadcrumb-item">
                        <router-link to="/">Home</router-link>
                    </li>
                    <li class="breadcrumb-item active">Dashboard v1</li>
                </ol>
            </div> -->
        <!-- /.col -->
      </div>
      <!-- /.row -->
    </div>
    <!-- /.container-fluid -->
  </div>
  <!-- /.content-header -->

  <!-- Main content -->
  <section class="content">
    <div class="container-fluid">
      <!-- Small boxes (Stat box) -->
      <div class="row">
        <div class="col-lg-6 col-6 btn" @click="getNewRecording()">
          <!-- small box -->
          <div class="small-box bg-info">
            <div class="inner">
              <h3>دریافت کلاس های برگذار شده از پورتال</h3>
            </div>
          </div>
        </div>
        <!-- ./col -->
      </div>
      <!-- /.row -->
    </div>
    <!-- /.container-fluid -->
  </section>
  <!-- /.content -->
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { ClassServiceApi } from '@/api/services/admin/class-service';
//
import alertify from '@/assets/alertifyjs/alertify';

export default defineComponent({
  setup() {
    const getNewRecording = () => {
      ClassServiceApi.getNewRecording().then((result) => {});
      alertify.success('عملیات شروع شد.');
    };

    return {
      getNewRecording
    };
  }
});
</script>
<style lang="scss"></style>
