<template lang="">
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
            <el-button type="primary">添加角色</el-button>
            <tree-table :data="catesList" :columns="columns" :selection-type="false" :expand-type="false"
                :show-row-hover="false" :show-index="true" index-text="#" border>
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success"></i>
                    <i class="el-icon-error"></i>
                </template>
            </tree-table>
            <!-- 分页区间 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5,10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                catesList: [],
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5
                },
                columns: [{
                    label: '分类名称',
                    prop: 'cat_name'
                }, {
                    label: '是否有效',
                    type: 'template',
                    template: 'isok'
                }]
            }
        },
        created() {
            this.getcatesList()
        },
        methods: {
            getcatesList() {
                this.$http.get('categories', {
                    params: this.queryInfo
                }).then(res => {
                    if (res.data.meta.status == 200) {
                        this.catesList = res.data.data.result
                        console.log(this.catesList);
                    } else {
                        this.$message.error({
                            type: 'error',
                            message: '获取分类失败',
                            duration: 1000
                        })
                    }
                })
            }
        },
    }
</script>
<style lang="less" scoped>
</style>