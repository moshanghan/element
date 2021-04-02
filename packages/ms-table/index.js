import MsTable from './src/ms-table.vue';

/* istanbul ignore next */
MsTable.install = function(Vue) {
  Vue.component(MsTable.name, MsTable);
};

export default MsTable;
