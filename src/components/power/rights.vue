<template lang="">
    <div class="contanier">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-table :data="rightList" border stripe max-height="550px">
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column prop="authName" label="权限名称">
                </el-table-column>
                <el-table-column prop="path" label="路径">
                </el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level=='0'" type="success">一级</el-tag>
                        <el-tag v-if="scope.row.level=='1'" type="info">二级</el-tag>
                        <el-tag v-if="scope.row.level=='2'" type="danger">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                rightList: []
            }
        },
        created() {
            this.getrightList();
        },
        methods: {
            getrightList() {
                this.$http.get('rights/list').then(res => {
                    // console.log(res);
                    if (res.status == 200) {
                        this.rightList = res.data.data
                        // console.log(this.rightList);
                    } else {
                        this.$message.error('获取数据失败')
                    }
                })
            }
        },
    }
</script>
<style lang="less" scoped>
</style>