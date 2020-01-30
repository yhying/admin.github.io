<template lang="">
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品参数</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert title="警告提示的文案" type="warning" :closable="false" show-icon>
            </el-alert>
            <el-row>
                <el-col>
                    <span class="goods">选择商品分类</span>
                    <el-cascader v-model="selectKeys" :options="parentscatesList" expand-trigger="hover" :props="cass"
                        @change="handleChange" clearable></el-cascader>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                parentscatesList: [],
                selectKeys: [],
                cass: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                }

            }
        },
        created() {
            this.getcatesList()
        },
        methods: {
            getcatesList() {
                this.$http.get('categories', {
                    params: {
                        type: 3
                    }
                }).then(res => {
                    if (res.data.meta.status == 200) {
                        this.parentscatesList = res.data.data
                        // console.log(this.parentscatesList);
                    }
                })
            },
            handleChange() {
                console.log(this.selectKeys);
                if(this.selectKeys.length<3){
                   this.selectKeys=[]
                   return;
                }
            }
        },
    }
</script>
<style lang="less" scoped>
    .el-row {
        margin-top: 15px;
    }

    .goods {
        margin-right: 15px;
    }
</style>