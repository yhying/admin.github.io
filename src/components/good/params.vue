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
                    <el-button type="primary" size="mini" :disabled="isdisabled" @click="addActiveprams()">添加参数
                    </el-button>
                    <el-table :data="manyTableData" border stripe max-height="330px">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item,i) in scope.row.attr_vals" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>
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
                                    @click="deletePrams(scope.row)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isdisabled" @click="addrelativeprams()">添加属性
                    </el-button>
                    <el-table :data="onlyTableData" border stripe max-height="330px">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item,i) in scope.row.attr_vals" closable>{{item}}</el-tag>
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>
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
                                    @click="deletePrams(scope.row)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加属性对话框 -->
        <el-dialog :title="'添加'+isText" :visible.sync="dialogVisible" width="50%" @close="closeDialog()">
            <el-form :model="addForm" :rules="addrules" ref="addruleForm" label-width="100px">
                <el-form-item :label="isText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addPrams()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑属性对话框 -->
        <el-dialog :title="'修改'+isText" :visible.sync="EditdialogVisible" width="50%" @close="editDialogClosed()">
            <el-form :model="EditForm" :rules="addrules" ref="EditruleForm" label-width="100px">
                <el-form-item :label="isText" prop="attr_name">
                    <el-input v-model="EditForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="EditdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="EditPrams()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                parentscatesList: [],
                selectKeys: [],
                dialogVisible: false,
                EditdialogVisible: false,
                addForm: {
                    attr_name: ''
                },
                EditForm: {},
                addrules: {
                    attr_name: [{
                        required: true,
                        message: '请输入参数名称',
                        trigger: 'blur'
                    }]
                },
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
            },
            isText() {
                if (this.activeName === 'many') {
                    return '动态参数'
                }
                return '静态属性'
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
                    this.manyTableData=[]
                    this.onlyTableData=[]
                    return;
                }
                this.getgoodprams()
            },
            handleClick() {
                // console.log(this.activeName);
                if (this.selectKeys.length === 3) {
                    this.getgoodprams()
                }
            },
            addActiveprams() {
                this.dialogVisible = true;
            },
            addrelativeprams() {
                this.dialogVisible = true;
            },
            closeDialog() {
                this.$refs.addruleForm.resetFields();
            },
            editDialogClosed() {
                this.$refs.EditruleForm.resetFields()
            },
            // 编辑对话框
            showEditDailog(e) {
                // console.log(e);
                this.EditForm = e
                this.EditdialogVisible = true;
            },
            handleInputConfirm(e) {
                // console.log(e);
                if (e.inputValue.trim().length === 0) {
                    e.inputValue = ''
                    e.inputVisible = false;
                    return
                }
                e.attr_vals.push(e.inputValue.trim())
                this.SaveAttrvals(e)
                e.inputValue = ''
                e.inputVisible = false;
            },
            SaveAttrvals(e){
                this.$http.put('categories/' + this.selectKeys[this.selectKeys.length - 1] + '/attributes/' + e
                .attr_id, {
                    attr_name: e.attr_name,
                    attr_sel: e.attr_sel,
                    attr_vals: e.attr_vals.join(',')
                }).then(res => {
                    if (res.data.meta.status == 200) {
                        this.$message({
                            type: 'success',
                            message: '更新成功',
                            duration: 1000
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: '更新失败',
                            duration: 1000
                        });
                    }
                })
            },
            showInput(e) {
                e.inputVisible = true;
                // 让文本框自动获得焦点
                // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus()
                })
            },
            // 删除tag参数标签
            handleClose(i,e){
                e.attr_vals.splice(i,1)
                this.SaveAttrvals(e)
            },
            // 确定修改参数
            EditPrams() {
                this.$refs.EditruleForm.validate(valid => {
                    if (!valid) return;
                    this.$http.put('categories/' + this.selectKeys[this.selectKeys.length - 1] +
                        '/attributes/' + this.EditForm.attr_id, {
                            attr_name: this.EditForm.attr_name,
                            attr_sel: this.activeName
                        }).then(res => {
                        // console.log(res);
                        if (res.data.meta.status !== 200) {
                            return this.$message({
                                type: 'error',
                                message: '修改参数失败',
                                duration: 1000
                            });
                        }
                        this.$message({
                            type: 'success',
                            message: '修改参数成功',
                            duration: 1000
                        });
                        this.getgoodprams();
                        this.EditdialogVisible = false;
                    })
                })
            },
            // 删除参数
            deletePrams(e) {
                this.EditForm = e
                this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log(this.EditForm.attr_id);
                    this.$http.delete('categories/' + this.selectKeys[this.selectKeys.length - 1] +
                        '/attributes/' + this.EditForm.attr_id).then(res => {
                        // console.log(res);
                        if (res.data.meta.status == 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功',
                                duration: 1000
                            });
                            this.getgoodprams();
                        } else {
                            this.$message({
                                type: 'error',
                                message: '删除失败',
                                duration: 1000
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                        duration: 1000
                    });
                });
            },
            // 添加属性方法
            addPrams() {
                this.$refs.addruleForm.validate(valid => {
                    if (!valid) return
                    this.$http.post('categories/' + this.selectKeys[this.selectKeys.length - 1] +
                        '/attributes', {
                            attr_sel: this.activeName,
                            attr_name: this.addForm.attr_name,
                        }).then(res => {
                        // console.log(res);
                        if (res.data.meta.status == 201) {
                            this.$message({
                                type: 'success',
                                message: '添加成功',
                                duration: 1000
                            });
                            this.dialogVisible = false;
                            this.getgoodprams();
                        } else {
                            this.$message({
                                type: 'error',
                                message: '添加失败',
                                duration: 1000
                            });
                        }
                    })
                })
            },
            getgoodprams() {
                this.$http.get('categories/' + this.selectKeys[this.selectKeys.length - 1] + '/attributes', {
                    params: {
                        sel: this.activeName
                    }
                }).then(res => {
                    // console.log(res);
                    res.data.data.forEach((item, i) => {
                        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];
                        item.inputVisible = false;
                        item.inputValue = ''
                        // console.log(item.attr_vals);
                    })
                    if (res.data.meta.status === 200) {
                        if (this.activeName === 'many') {
                            this.manyTableData = res.data.data
                        } else {
                            this.onlyTableData = res.data.data
                        }
                        // console.log(this.manyTableData);
                        // console.log(this.onlyTableData);
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

    .el-tag {
        margin: 10px;
    }

    .button-new-tag {
        margin-left: 10px;
    }

    .input-new-tag {
        width: 90px;
        margin-left: 10px;
    }
</style>