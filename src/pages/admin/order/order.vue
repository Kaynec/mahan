<template>
  <div class="panel panel-default">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">فاکتور ها</h1>
          </div>
          <div class="col-sm-6">
            <button
              class="m-0 float-left btn btn-success"
              @click="createOrder()"
            >
              فاکتور جدید
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
        <grid :columns="columns" :options="options" ref="grid"></grid>
        <!-- /.row -->
      </div>
      <!-- /.container-fluid -->
    </section>
    <!-- /.content -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive } from 'vue';
import { baseUrl } from '@/api/apiclient';
import grid from '@/modules/shared/grid.vue';
import router from '@/router';
import { OrderServiceApi } from '@/api/services/admin/order-service';
const $ = require('jquery');
import alertify from '@/assets/alertifyjs/alertify';
var moment = require('jalali-moment');

export default defineComponent({
  components: { grid },

  setup() {
    const grid = ref();
    // Data
    const columns = reactive([
      {
        label: 'دانشجو ',
        data: (data: any) => {
          return data.student
            ? data.student.firstname + ' ' + data.student.lastname
            : '';
        },
        responsivePriority: 1
      },
      {
        label: 'تعداد محصول ',
        data: (data: any) => {
          let sum = 0;
          data.items.forEach((item) => {
            sum += item.quantity;
          });
          return sum;
        },
        responsivePriority: 1
      },
      {
        label: 'تاریخ',
        data: 'createdAt',
        responsivePriority: 1,
        render: function (data: any) {
          return `<span>${moment(data).locale('fa').format('LLLL')}</span>`;
        }
      },
      {
        label: 'وضعیت',
        data: 'status',
        responsivePriority: 1,
        render: function (data: any) {
          let status = 'در انتظار پرداخت';
          switch (data) {
            case 'pending':
              status = 'در انتظار پرداخت';
              break;
            case 'paid':
              status = 'پرداخت شده';
              break;
            case 'cancel':
              status = 'لغو شده';
              break;
          }
          return `<span>${status}</span>`;
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
        responsivePriority: 1
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
      gridName: 'order-grid',
      url: `${baseUrl}order`,
      type: 'GET'
    });

    const editOrder = (order: any) => {
      router.push({
        name: 'order-edit',
        params: { orderId: order._id }
      });
    };

    const deleteOrder = async (order: any) => {
      alertify.defaults.glossary.ok = 'خیر';
      alertify.defaults.glossary.cancel = 'بله';
      alertify.confirm('حذف', 'آیا اطمینان دارید؟', function (e: any) {
        if (e) {
          OrderServiceApi.delete(order._id).then((result: any) => {
            alertify.success(result.data.message);
            (grid.value as any).getDatatable().ajax.reload();
          });
        }
      });
    };

    const createOrder = () => {
      router.push({
        name: 'order-create',
        params: { order: JSON.stringify({}) }
      });
    };
    onMounted(() => {
      if (grid.value.getDatatable()) {
        grid.value
          .getDatatableBody()
          .on('click', '[data-edit-id]', (e: any) => {
            let id = $(e.currentTarget).data().editId;
            let filteredData = grid.value
              .getDatatable()
              .data()
              .filter(function (value: any) {
                return value._id == id;
              });
            if (filteredData.length > 0) editOrder(filteredData[0]);
          });
        grid.value
          .getDatatableBody()
          .on('click', '[data-delete-id]', (e: any) => {
            let id = $(e.currentTarget).data().deleteId;
            let filteredData = grid.value
              .getDatatable()
              .data()
              .filter(function (value: any) {
                return value._id == id;
              });
            if (filteredData.length > 0) deleteOrder(filteredData[0]);
          });
      }
    });

    return {
      options,
      columns,
      createOrder,
      grid
    };
  }
});
</script>
