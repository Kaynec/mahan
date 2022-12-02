<template>
  <div class="panel panel-default">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">باندل ها</h1>
          </div>
          <div class="col-sm-6">
            <button
              class="m-0 float-left btn btn-success"
              @click="createItem()"
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
import gridComponent from '@/modules/shared/grid.vue';
import router from '@/router';
import { BundleServiceApi } from '@/api/services/admin/bundle-service';
import alertify from '@/assets/alertifyjs/alertify';
import { useAdminStore } from '@/store';
const $ = require('jquery');

console.log(useAdminStore().state.users);
// ref
const grid = ref();
// Data
const columns = reactive([
  {
    label: 'عنوان باندل',
    data: 'title',
    responsivePriority: 1,
    searchPanes: {
      orthogonal: 'sp',
      show: true
    }
  },
  {
    label: 'قیمت ',
    data: 'price',
    responsivePriority: 3
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
  // gridName: 'session-grid',
  gridName: 'bundle-grid',
  url: `${baseUrl}productBundle`,
  type: 'GET'
});

const editItem = (item: any) => {
  router.push({
    name: 'bundle-edit',
    params: { productId: item._id }
  });
};

const deleteItem = (item: any) => {
  alertify.defaults.glossary.ok = 'خیر';
  alertify.defaults.glossary.cancel = 'بله';
  alertify.confirm('حذف', 'آیا اطمینان دارید؟', function (e: any) {
    if (e) {
      BundleServiceApi.delete(item._id).then((result: any) => {
        alertify.success(result.data.message);
        (grid.value as any).getDatatable().ajax.reload();
      });
    }
  });
};

const createItem = () => {
  router.push({
    name: 'bundle-create'
  });
};
onMounted(() => {
  if (grid.value.getDatatable()) {
    grid.value.getDatatableBody().on('click', '[data-edit-id]', (e: any) => {
      let id = $(e.currentTarget).data().editId;
      let filteredData = grid.value
        .getDatatable()
        .data()
        .filter(function (value: any) {
          return value._id == id;
        });
      if (filteredData.length > 0) editItem(filteredData[0]);
    });
    grid.value.getDatatableBody().on('click', '[data-delete-id]', (e: any) => {
      let id = $(e.currentTarget).data().deleteId;
      let filteredData = grid.value
        .getDatatable()
        .data()
        .filter(function (value: any) {
          return value._id == id;
        });
      if (filteredData.length > 0) deleteItem(filteredData[0]);
    });
  }
});
</script>
