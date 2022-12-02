<template>
  <div class="panel panel-default">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">کانت داون ها</h1>
          </div>
          <div class="col-sm-6">
            <button
              class="m-0 float-left btn btn-success"
              @click="createCountDown()"
            >
              جدید
            </button>
          </div>
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
        <gridComponent
          :columns="columns"
          :options="options"
          ref="grid"
        ></gridComponent>
        <!-- /.row -->
      </div>
      <!-- /.container-fluid -->
    </section>
    <!-- /.content -->
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';
import { baseUrl } from '@/api/apiclient';
import router from '@/router';
import { useRoute } from 'vue-router';

import alertify from '@/assets/alertifyjs/alertify';
import { CountDownServiceApi } from '@/api/services/admin/count-down-service';
import gridComponent from '@/modules/shared/grid.vue';
import { GradeServiceApi } from '@/api/services/admin/grade-service';
const $ = require('jquery');

const route = useRoute();

const grid = ref();

const grades = ref<any[]>([]);

GradeServiceApi.getAll().then((res) => {
  res.data.data.forEach((data: any) => {
    grades.value.push(data);
    grid.value.getDatatable().ajax.reload();
  });
});

const columns = reactive([
  {
    label: 'نام ',
    data: 'title',
    responsivePriority: 1,
    searchPanes: {
      orthogonal: 'sp',
      show: true
    }
  },
  {
    label: 'متن ',
    data: 'description',
    responsivePriority: 3,
    searchPanes: {
      orthogonal: 'sp',
      show: true
    }
  },
  {
    label: 'عدد شمارش',
    data: 'countNumber',
    responsivePriority: 3,
    searchPanes: {
      orthogonal: 'sp',
      show: true
    }
  },
  {
    label: 'مقطع',
    data: 'grade',
    render: (data: any) => {
      return `${grades.value.find((el) => el._id === data)?.title || ''} `;
    },
    responsivePriority: 3,
    searchPanes: {
      orthogonal: 'sp',
      show: true
    }
  },
  {
    className: 'edit-control',
    orderable: false,
    defaultContent: '',
    label: '',
    data: '_id',
    action: 'update',
    width: 100,
    render: function (data: any) {
      return `<button type="button" data-edit-id="${data}" class="btn btn-default edit-button">ویرایش</button>`;
    },
    responsivePriority: 2
  },

  {
    label: '',
    data: '_id',
    action: 'delete',
    width: 100,
    render: function (data: any) {
      return `<button type="button" data-delete-id="${data}" class="btn btn-danger edit-button">حذف</button>`;
    },
    responsivePriority: 1
  }
]);

const options = reactive({
  gridName: 'count-down-grid',
  url: `${baseUrl}count-down`,
  type: 'GET'
});

const editCountDown = (countDown: any) => {
  router.push({
    name: 'count-down-edit',
    params: { countDown: JSON.stringify(countDown) }
  });
};

const deleteCountDown = (CountDowm: any) => {
  alertify.defaults.glossary.ok = 'خیر';
  alertify.defaults.glossary.cancel = 'بله';
  alertify.confirm('حذف', 'آیا اطمینان دارید؟', function (e: any) {
    if (e) {
      CountDownServiceApi.delete(CountDowm._id).then((result: any) => {
        alertify.success(result.data.message);
        (grid.value as any).getDatatable().ajax.reload();
      });
    }
  });
};

const createCountDown = () => {
  router.push({
    name: 'count-down-create',
    params: { countDown: JSON.stringify({}) }
  });
};
onMounted(() => {
  if (grid.value.getDatatable()) {
    //
    grid.value.getDatatableBody().on('click', '[data-edit-id]', (e: any) => {
      let id = $(e.currentTarget).data().editId;
      let filteredData = grid.value
        .getDatatable()
        .data()
        .filter(function (value: any) {
          return value._id == id;
        });
      if (filteredData.length > 0) editCountDown(filteredData[0]);
    });
    grid.value.getDatatableBody().on('click', '[data-delete-id]', (e: any) => {
      let id = $(e.currentTarget).data().deleteId;
      let filteredData = grid.value
        .getDatatable()
        .data()
        .filter(function (value: any) {
          return value._id == id;
        });
      if (filteredData.length > 0) deleteCountDown(filteredData[0]);
    });
  }
});
</script>
