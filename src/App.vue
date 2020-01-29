<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style>
  .el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
  }

  .el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
  }

  .el-pagination {
    margin-top: 10px;
  }

  .el-table {
    margin-top: 15px;
    font-size: 12px;
  }
</style>