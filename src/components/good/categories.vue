<template lang="">
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
            <el-button type="primary" @click="addCate()">添加分类</el-button>
            <tree-table style="margin-top: 15px;" :data="catesList" :columns="columns" :selection-type="false"
                :expand-type="false" :show-row-hover="false" :show-index="true" index-text="#" border>
                <template slot="isok" slot-scope="scope">
                    <i v-if="scope.row.cat_deleted==false" style="color:lightgreen" class="el-icon-success"></i>
                    <i v-else style="color:red" class="el-icon-error"></i>
                </template>
                <template slot="order" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level=='0'" type="success">一级</el-tag>
                    <el-tag v-if="scope.row.cat_level=='1'" type="info">二级</el-tag>
                    <el-tag v-if="scope.row.cat_level=='2'" type="danger">三级</el-tag>
                </template>
                <template slot="btn" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDailog(scope.row)">编辑
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)">删除
                    </el-button>
                </template>
            </tree-table>
            <!-- 分页区间 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5,10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加分类对话框 -->
        <el-dialog title="添加分类" :visible.sync="dialogVisible" width="50%" @close="closeDailog()">
            <el-form :model="addCateForm" :rules="Caterules" ref="ruleValue" label-width="80px" class="demo-ruleForm">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-cascader v-model="selectKeys" :options="parentscatesList" expand-trigger="hover" :props="cass"
                        @change="handleChange" clearable change-on-select></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addcatesbtn()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                total: '',
                dialogVisible: false,
                catesList: [],
                selectKeys: [],
                // 父级分类列表
                parentscatesList: [],
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
                }, {
                    label: '排序',
                    type: 'template',
                    template: 'order'
                }, {
                    label: '操作',
                    type: 'template',
                    template: 'btn'
                }],
                addCateForm: {
                    // 将要添加的分类的名称
                    cat_name: '',
                    // 父级分类的Id
                    cat_pid: 0,
                    // 分类的等级，默认要添加的是1级分类
                    cat_level: 0
                },
                Caterules: {
                    cat_name: [{
                        required: true,
                        message: '请输入分类名称',
                        trigger: 'blur'
                    }]
                },
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
                    params: this.queryInfo
                }).then(res => {
                    // console.log(res);
                    if (res.data.meta.status == 200) {
                        this.catesList = res.data.data.result
                        this.total = res.data.data.total
                        // console.log(this.catesList);
                    } else {
                        this.$message.error({
                            type: 'error',
                            message: '获取分类失败',
                            duration: 1000
                        })
                    }
                })
            },
            handleSizeChange(e) {
                this.queryInfo.pagesize = e
                this.getcatesList()
            },
            handleCurrentChange(e) {
                this.queryInfo.pagenum = e
                this.getcatesList()
            },
            // 获取二层分类数据
            getCates() {
                this.$http.get('categories', {
                    params: {
                        type: 2
                    }
                }).then(res => {
                    if (res.data.meta.status == 200) {
                        this.parentscatesList = res.data.data
                        // console.log(this.parentscatesList);
                    }
                })
            },
            // 添加分类
            addCate() {
                this.getCates()
                this.dialogVisible = true;
            },
            closeDailog() {
                this.$refs.ruleValue.resetFields()
                this.selectKeys = []
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            },
            handleChange() {
                if (this.selectKeys.length > 0) {
                    this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
                    this.addCateForm.cat_level = this.selectKeys.length
                } else {
                    this.addCateForm.cat_pid = 0
                    this.addCateForm.cat_level = 0
                }
            },
            addcatesbtn() {
                this.$refs.ruleValue.validate(valid => {
                    if (!valid)
                        return;
                    this.$http.post('categories', this.addCateForm).then(res => {
                        if (res.data.meta.status == 201) {
                            this.$message({
                                message:'添加分类成功',
                                type: 'success',
                                duration: 1000
                            });
                            this.getcatesList()
                            this.dialogVisible=false;
                        }else {
                            this.$message({
                                message:'添加分类失败',
                                type: 'error',
                                duration: 1000
                            });
                        }
                    })
                })
            }
        },
    }
</script>
<style lang="less" scoped>
    .el-cascader {
        width: 100%;
    }
</style>