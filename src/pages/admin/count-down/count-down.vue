<template>
  <div class="panel panel-default">
    <div class="form-row">
      <div class="form-group col-md-4 col-sm-12">
        <label> مقطع </label>
        <select
          v-model="currentGrade"
          class="form-select"
          aria-label="مقطع را انتخاب کنید "
          placeholder="مقطع را انتخاب کنید"
        >
          <option
            v-for="grade in grades"
            :key="grade.title"
            @blur="v$.course.$touch()"
            :value="grade._id"
          >
            {{ grade.title }}
          </option>
        </select>
      </div>
    </div>
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
import { ref, onMounted, reactive, computed, watch } from 'vue';
import { baseUrl } from '@/api/apiclient';
import router from '@/router';
import { useRoute } from 'vue-router';

import alertify from '@/assets/alertifyjs/alertify';
import { CountDownServiceApi } from '@/api/services/admin/count-down-service';
import gridComponent from '@/modules/shared/grid.vue';
import { GradeServiceApi } from '@/api/services/admin/grade-service';
import $ from 'jquery';

const route = useRoute();

let grades = ref([] as any);
let currentGrade = ref(route.params.gradeId || '');
GradeServiceApi.getAll().then((res) => {
  res.data.data.forEach((data: any) => {
    grades.value.push(data);
  });
});

watch(currentGrade, (cur, prev) => {
  route.params.gradeId = currentGrade.value;
  grid.value.getDatatable().ajax.reload();
});

watch(route.params, (cur, prev) => {
  currentGrade.value = route.params.gradeId;
  grid.value.getDatatable().ajax.reload();
});

const grid = ref();

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
  type: 'GET',
  data: (d: any) => {
    d.filter = {};
    if (currentGrade.value) {
      d.filter.grade = currentGrade.value;
    }
  }
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
