<!---->
<template>
  <el-pagination
    v-if="pageData.total>30"
    ref="pagination"
    background
    :current-page="pageData.pageNum"
    :page-size="30"
    layout="total, prev, pager, next, jumper"
    :total="pageData.total"
    @current-change="$emit('change',arguments[0],1)"
  >
  </el-pagination>
</template>

<script>
import ElPagination from 'element-ui/packages/pagination';

export default {
  components: { ElPagination },
  props: {
    pageData: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
