<template lang="">
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品参数</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert title="注意：只允许修改三级分类的参数" type="warning" :closable="false" show-icon>
            </el-alert>
            <el-row>
                <el-col>
                    <span class="goods">选择商品分类</span>
                    <el-cascader v-model="selectKeys" :options="parentscatesList" expand-trigger="hover" :props="cass"
                        @change="handleChange" clearable></el-cascader>
                </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isdisabled">添加参数</el-button>
                    <el-table :data="manyTableData" border stripe max-height="490px">
                        <el-table-column type="expand">
                        </el-table-column>
                        <el-table-column type="index" label="#">
                        </el-table-column>
                        <el-table-column prop="attr_name" label="参数名称">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                    @click="showEditDailog(scope.row)">编辑
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                    @click="deleteUser(scope.row.id)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isdisabled">添加属性</el-button>
                </el-tab-pane>
            </el-tabs>
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
                },
                activeName: 'first',
                manyTableData: [],
                onlyTableData: [],
                onList: [],
                activeName: 'many'

            }
        },
        created() {
            this.getcatesList()
            // console.log(this.selectKeys);
        },
        computed: {
            // 监听按钮禁用
            isdisabled() {
                if (this.selectKeys.length === 3) {
                    return false;
                } else {
                    return true
                }
            }
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
                // console.log(this.selectKeys[this.selectKeys.length-1]);
                if (this.selectKeys.length < 3) {
                    this.selectKeys = []
                    return;
                }
                this.getgoodprams()
            },
            handleClick() {
                console.log(this.activeName);
                this.getgoodprams()
            },
            getgoodprams() {
                this.$http.get('categories/' + this.selectKeys[this.selectKeys.length - 1], {
                    params: {
                        sel: this.activeName
                    }
                }).then(res => {
                    console.log(res);
                    if (res.data.meta.status == 200) {
                        if(this.activeName==='many'){
                            this.manyTableData = res.data.data
                        }else {
                            this.onlyTableData = res.data.data
                        }
                        console.log(this.manyTableData);
                        console.log(this.onlyTableData);
                    } else {
                        this.$message({
                            type: 'error',
                            message: '获取参数列表失败',
                            duration: 1000
                        });
                    }
                })
            }
        },
    }
</script>
<style lang="less" scoped>
    .el-row {
        margin-top: 15px;
        margin-bottom: 10px;
    }

    .goods {
        margin-right: 15px;
    }

    .el-cascader {
        width: 30%;
    }
</style>