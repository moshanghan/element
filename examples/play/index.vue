<template>
  <div class="ml-flex aaa" >
    <ms-table :table-data="tableData"/>
  </div>
</template>

<script>
import { tlist } from './data.js'
export default {
  data() {
    return {
      tableData: {
        loading: true,
        list:[],
        total: 0,
        rowData: {},
        columnData: [
          {
            label: '地区',
            prop: 'area'
          },
          {
            label: '企业总数（家）',
            prop: 'countAll'
          },
          {
            label: '正常企业数量（家)',
            prop: 'normal'
          },
          {
            label: '关闭企业数量（家)',
            prop: 'closed'
          },
          {
            label: '停办企业数量（家)',
            prop: 'stoped'
          },
          {
            label: '合并企业数量（家）',
            prop: 'merger'
          },
          {
            label: '转产企业数量（家）',
            prop: 'switched'
          },
          {
            label: '已评估企业数量（家）',
            prop: 'assess'
          },
          {
            label: '未评估企业数量（家）',
            prop: 'notAssess'
          },
          {
            label: '评估完成率',
            prop: 'assessRate'
          },
          {
            label: '已投保企业数量（家）',
            prop: 'policy'
          },
          {
            label: '未投保企业数量（家）',
            prop: 'notPolicy'
          },
          {
            label: '投保完成率',
            prop: 'policyRate'
          },
          {
            label: '已排查企业数量（家）',
            prop: 'riskCount'
          },
          {
            label: '未排查企业数量（家）',
            prop: 'notRiskCount'
          },
          {
            label: '排查完成率',
            prop: 'riskRate'
          }
        ]
      }
    };
  },
  created() {
    this.tableData.list = tlist;
    setTimeout(()=>{
    this.tableData.loading = false;
    },200)
  }
};
</script>
<style>
.aaa{
  max-height: calc(100vh - 60px);
  margin: 30px;
}
.ml-flex {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
</style>
