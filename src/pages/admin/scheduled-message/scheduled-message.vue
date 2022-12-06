<template>
  <div class="panel panel-default">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">پیام های زمان دار</h1>
          </div>
          <div class="col-sm-6">
            <button
              class="m-0 float-left btn btn-success"
              @click="createscheduledMessage()"
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
import alertify from '@/assets/alertifyjs/alertify';
import { ScheduledMessageServiceApi } from '@/api/services/admin/scheduled-message-service';
import gridComponent from '@/modules/shared/grid.vue';
import $ from 'jquery';

const grid = ref();
// Data
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
    label: 'زمان شروع ',
    data: 'startTime',
    responsivePriority: 3,
    searchPanes: {
      orthogonal: 'sp',
      show: true
    }
  },
  {
    label: 'زمان پایان ',
    data: 'endTime',
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
  gridName: 'scheduled-message-grid',
  url: `${baseUrl}scheduled-message`,
  type: 'GET'
});

const editAnnouncement = (scheduledMessage: any) => {
  router.push({
    name: 'scheduled-message-edit',
    params: { scheduledMessage: JSON.stringify(scheduledMessage) }
  });
};

const deleteAnnouncement = (scheduledMessage: any) => {
  alertify.defaults.glossary.ok = 'خیر';
  alertify.defaults.glossary.cancel = 'بله';
  alertify.confirm('حذف', 'آیا اطمینان دارید؟', function (e: any) {
    if (e) {
      ScheduledMessageServiceApi.delete(scheduledMessage._id).then(
        (result: any) => {
          alertify.success(result.data.message);
          (grid.value as any).getDatatable().ajax.reload();
        }
      );
    }
  });
};

const createscheduledMessage = () => {
  router.push({
    name: 'scheduled-message-create',
    params: { scheduledMessage: JSON.stringify({}) }
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
      if (filteredData.length > 0) editAnnouncement(filteredData[0]);
    });
    grid.value.getDatatableBody().on('click', '[data-delete-id]', (e: any) => {
      let id = $(e.currentTarget).data().deleteId;
      let filteredData = grid.value
        .getDatatable()
        .data()
        .filter(function (value: any) {
          return value._id == id;
        });
      if (filteredData.length > 0) deleteAnnouncement(filteredData[0]);
    });
  }
});
</script>
