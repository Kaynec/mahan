<template>
  <table class="display nowrap" :id="options.gridName" style="width: 100%">
    <thead>
      <tr>
        <th
          v-for="col in columns"
          class="table-head"
          :key="col.data"
          :class="col.headerClass"
        >
          {{ col.label }}
        </th>
      </tr>
    </thead>
  </table>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useAdminStore } from '@/store';
import 'jquery/dist/jquery.min.js';
import 'datatables.net-dt/js/dataTables.dataTables';

import 'jszip';
import 'datatables.net-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.colVis.js';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';
import 'datatables.net-responsive-bs5';
import 'datatables.net-scroller-bs5';
import 'datatables.net-searchpanes';
import 'datatables.net-searchpanes-bs5';
import 'datatables.net-searchbuilder-bs5';
import 'datatables.net-select-bs5';
import 'datatables.net-datetime';

import $ from 'jquery';

export default defineComponent({
  name: 'Grid',
  props: {
    columns: [],
    data: [],
    options: {}
  },
  data(): any {
    return {
      appElement: null,
      datatable: null
    };
  },
  mounted(): void {
    this.appElement = document.getElementById('app') as HTMLElement;
    this.datatable = $('#' + this.options.gridName).DataTable({
      language: {
        decimal: '',
        emptyTable: 'موردی یافت نشد',
        info: 'نمایش _START_ تا _END_ از _TOTAL_ داده',
        infoEmpty: 'نمایش 0 تا 0 از 0 داده',
        infoFiltered: '(filtered from _MAX_ total entries)',
        infoPostFix: '',
        thousands: ',',
        lengthMenu: 'داده در هر صفحه _MENU_',
        loadingRecords: 'در حال بارگذاری...',
        processing: 'در حال محاسبه...',
        search: 'جستجو:',
        zeroRecords: 'موردی یافت نشد',
        paginate: {
          first: 'اولین',
          last: 'آخرین',
          next: 'بعدی',
          previous: 'قبلی'
        },
        aria: {
          sortAscending: ': activate to sort column ascending',
          sortDescending: ': activate to sort column descending'
        }
      },
      responsive: true,
      columns: this.columns,
      ajax: {
        url: this.options.url,
        type: this.options.type,
        data: this.options.data,
        beforeSend: function (request: any) {
          const token = useAdminStore().getters.getUserToken;
          request.setRequestHeader('token', token);
        }
      },
      pageLength: 10,
      serverSide: true
    });
  },
  methods: {
    getDatatable() {
      return this.datatable;
    },
    getDatatableBody() {
      return $(`#${this.options.gridName} tbody`);
    }
  }
});
</script>
<style lang="scss" scoped>
.table-head {
  text-align: right;
}
</style>
