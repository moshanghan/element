<template>
  <div class="ms-table  ml-flex">
    <el-table
      ref="tables"
      v-loading="tableData.loading"
      :class="tableData.hideDisableCheckBox?'hide-disable-checkbox':''"
      border
      :height="tableData.height||'300'"
      :data="tableData.list"
      element-loading-text="加载中"
      :row-key="tableData.rowKey?tableData.rowKey:''"
      highlight-current-row
      :default-expand-all="tableData.defaultExpandAll?tableData.defaultExpandAll:false"
      :tree-props="tableData.treeProps?tableData.treeProps:{}"
      v-bind="$attrs"
      @selection-change="handleSelectionChange"
      @row-click="rowClickFn"
      @cell-click="handleCell"
    >
      <el-table-column
        v-if="tableData.isCheckbox"
        type="selection"
        width="55"
        fixed="left"
        align="center"
        :selectable="tableData.isCheckbox&&tableData.selectable?tableData.selectable:()=>true"
      >
      </el-table-column>
      <el-table-column
        v-for="item in tableData.columnData"
        :key="item.label"
        :prop="item.prop"
        :fixed="item.fixed"
        :type="item.type"
        :min-width="item.widthFlag ? item.width : colWidth(item)"
        :max-width="item.maxWidth"
        :label="item.label"
        :align="item.align?item.align:'left'"
        :show-overflow-tooltip="item.showOverflowTooltip"
      >
        <template slot-scope="scope">
          <ex-slot
            v-if="item.render"
            :render="item.render"
            :row="scope.row"
            :index="scope.$index"
            :column="item"
          />
          <span v-else-if="item.type==='radio'&&tableData.isRadio">
            <el-radio
              v-model="radioVal"
              class="table-radio-none"
              :disabled="item.radioDisableFn?item.radioDisableFn(scope.row):false"
              :label="scope.row[!tableData.radioKey?'id':tableData.radioKey]"
              @click.native.stop="handleSelectRadio($event,scope.row)"
            ></el-radio>
          </span>
          <span v-else-if="!item.type">{{ scope.row[item.prop] }}</span>
          <span v-else-if="item.type==='index'">{{ scope.$index + 1 }}</span>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pageNation
      :page-data="pageData"
      @change="pageChange"
    />
  </div>
</template>
<script>
import ElTable from 'element-ui/packages/table';
import ElTableColumn from 'element-ui/packages/table-column';
import { isEmpty } from 'lodash';
import pageNation from './components/page-nation.vue';

const exSlot = {
  functional: true,
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null
    }
  },
  render: (h, data) => {
    const params = {
      row: data.props.row,
      index: data.props.index
    };
    if (data.props.column) params.column = data.props.column;
    return data.props.render(h, params);
  }
};
export default {
  name: 'MsTable',
  componentName: 'MsTable',
  components: {
    exSlot,
    pageNation,
    ElTable,
    ElTableColumn
  },
  props: {
    tableData: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      reg: /[\u4E00-\u9FA5]|[^\x20-\xff]/g,
      radioVal: null,
      hFsize: 12,
      bFsize: 12,
      strTextTemp: ''
    };
  },
  computed: {
    colWidth() {
      return (colItem) => this.getColWidth(colItem);
    },
    pageData() {
      return {
        total: this.tableData.total,
        pageNum: this.tableData.pageNum
      };
    }
  },
  methods: {
    // 获取列宽
    getColWidth(colItem) {
      let curlDataTmep = 0;
      if (this.tableData && this.tableData.list) {
        // 表头的列
        const headName = colItem.label || 0;
        let headZnLength = 0;
        if (headName.match(this.reg)) {
          headZnLength = headName.match(this.reg).length;
        }
        // 获取font-size
        const thead = document.querySelector('thead');
        this.$nextTick(() => {
          if (thead) {
            const cell = thead.querySelector('.cell');
            const size = window.getComputedStyle(cell).fontSize;
            this.hFsize = size.split('px')[0] * 1;
          }
        });
        const hl = (headName.length - headZnLength) * 7 + headZnLength * this.hFsize;
        curlDataTmep = hl;
        // 表体的列
        const colName = colItem.prop;
        if (this.tableData.list.length) {
          const curlLenTmep2 = this.getColMaxWidth(colName, curlDataTmep, this.tableData.list, 1);
          // console.log('curlLenTmep2', curlLenTmep2);
          curlDataTmep = curlDataTmep > curlLenTmep2 ? curlDataTmep : curlLenTmep2;
        } else {
          curlDataTmep = 80;
        }
        // 三个宽度求最大值 列宽最小值 列宽 以及计算的内容的宽度 根据最大值 来显示列宽
        const colWidth = colItem.width || 0;
        const colMinWidth = colItem.minWidth || 0;
        curlDataTmep = Math.max(...[colWidth, colMinWidth, curlDataTmep + 34]);
      } else {
        curlDataTmep = 80;
      }
      return curlDataTmep;
    },
    // 获取列的最大宽度 多级表格嵌套的处理
    getColMaxWidth(colName, curlDataTmep, dataList) {
      let copyDataTemp = curlDataTmep;
      dataList.forEach((item) => {
        if (item.children && item.children.length) {
          const curlLenTmep = this.getColMaxWidth(colName, copyDataTemp, item.children);
          copyDataTemp = (curlLenTmep > copyDataTemp ? curlLenTmep : copyDataTemp);
        }
        if (colName && item[colName] && item[colName].toString().length) {
          const tempText = item[colName].toString();
          let znLength = 0;
          if (tempText.match(this.reg)) {
            znLength = tempText.match(this.reg).length;
          }
          // 获取font-size
          const tbody = document.querySelector('thead');
          this.$nextTick(() => {
            if (tbody) {
              const cell = tbody.querySelector('.cell');
              const size = window.getComputedStyle(cell).fontSize;
              this.bFsize = size.split('px')[0] * 1;
            }
          });
          const tempTextLength = (tempText.length - znLength) * 7 + znLength * this.bFsize;
          copyDataTemp = (copyDataTemp > tempTextLength ? copyDataTemp : tempTextLength);
        }
      });
      return copyDataTemp;
    },
    pageChange(pageIndex) {
      this.initTable(null, {});
      this.$emit('change', pageIndex, 1);
    },
    handleSelectionChange(val) {
      this.$emit('handleSelectionChange', val);
    },
    // row点击
    rowClickFn(rowData) {
      if (this.tableData.rowClick) this.$emit('rowClick');
      if (this.tableData.isRadio) {
        const key = !this.tableData.radioKey ? 'id' : this.tableData.radioKey;
        // 点击选择切换
        if (this.radioVal && this.radioVal === rowData[key]) {
          this.$refs.tables.setCurrentRow();
          this.initTable();
          return false;
        }
        if (this.tableData.columnData[0].radioDisableFn) {
          const disableFlag = this.tableData.columnData[0].radioDisableFn(rowData);
          // 判断radio是否禁用
          this.initTable(disableFlag ? null : rowData[key], disableFlag ? {} : rowData);
          if (disableFlag) this.$refs.tables.setCurrentRow();
        } else {
          this.initTable(rowData[key], rowData);
        }
      }
      return false;
    },
    // 单选
    handleSelectRadio(event, rowData) {
      const { tagName } = event.target;
      if (tagName === 'INPUT') {
        const key = !this.tableData.radioKey ? 'id' : this.tableData.radioKey;
        if (this.radioVal) {
          this.initTable(null, {});
        } else if (!this.radioVal) {
          this.initTable(rowData[key], rowData);
        }
      }
    },
    initTable(val = null, rowData = {}) {
      if (!val || isEmpty(rowData)) {
        this.$refs.tables.setCurrentRow();
      }
      this.radioVal = val;
      this.$emit('handleRadioChange', rowData);
    },
    handleCell(row, column, cell, event) {
      this.$emit('cellClick', {
        row, column, cell, event
      });
    }
  }
};
</script>
