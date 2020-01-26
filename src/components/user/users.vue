<template lang="">
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="8">
                    <div>
                        <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable
                            @input="getuserList()" @clear="getuserList()">
                            <el-button slot="append" icon="el-icon-search" @click="getuserList()"></el-button>
                        </el-input>
                    </div>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <el-table :data="userList" style="width: 100%" border stripe>
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column prop="username" label="姓名">
                </el-table-column>
                <el-table-column prop="email" label="邮箱">
                </el-table-column>
                <el-table-column prop="mobile" label="电话">
                </el-table-column>
                <el-table-column prop="role_name" label="角色">
                </el-table-column>
                <el-table-column prop="mg_state" label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDailog(scope.row)">
                        </el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
                        <el-tooltip class="item" effect="dark" content="设置角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-s-tools" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区间 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5,10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加用户区域 -->
        <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="closeDailog()">
            <el-form :model="addForm" :rules="addrules" ref="ruleValue" label-width="70px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户 -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editCloseDailog()">
            <el-form :model="editForm" :rules="editrules" ref="editruleValue" label-width="70px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <!-- <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item> -->
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            var checkEmail = (rule, value, callback) => {
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
                if (!regEmail.test(value)) {
                    return callback(new Error('请输入合法邮箱'))
                }
                callback()
            }
            var checkMobile = (rule, value, callback) => {
                const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
                if (!regMobile.test(value)) {
                    return callback(new Error('请输入合法手机号'))
                }
                callback()
            }
            return {
                queryInfo: {
                    query: '',
                    // 当前的页数
                    pagenum: 1,
                    // 当前每页显示多少条数据
                    pagesize: 2
                },
                addForm: {
                    username: '',
                    password: ' ',
                    email: '',
                    mobile: ' '
                },
                editForm: {},
                addrules: {
                    username: [{
                            required: true,
                            message: '请输入用户名',
                            trigger: 'blur'
                        },
                        {
                            min: 3,
                            max: 10,
                            message: '长度在 3 到 10 个字符',
                            trigger: 'blur'
                        }
                    ],
                    password: [{
                            required: true,
                            message: '请输入密码',
                            trigger: 'blur'
                        },
                        {
                            min: 6,
                            max: 15,
                            message: '长度在 6 到 15 个字符',
                            trigger: 'blur'
                        }
                    ],
                    email: [{
                        validator: checkEmail,
                        trigger: 'blur'
                    }],
                    mobile: [{
                        validator: checkMobile,
                        trigger: 'blur'
                    }]
                },
                // 修改用户匹配规则
                editrules: {
                    email: [{
                            required: true,
                            message: '请输入用户邮箱',
                            trigger: 'blur'
                        },
                        {
                            validator: checkEmail,
                            trigger: 'blur'
                        }
                    ],
                    mobile: [{
                            required: true,
                            message: '请输入用户手机',
                            trigger: 'blur'
                        },
                        {
                            validator: checkMobile,
                            trigger: 'blur'
                        }
                    ]

                },
                userList: [],
                total: '',
                dialogVisible: false,
                editDialogVisible: false,

            }
        },
        created() {
            this.getuserList();
        },
        methods: {
            // 解决promise
            // async getuserList() {
            //     const {
            //         data: res
            //     } = await this.$http.get('users', {
            //         params: this.queryInfo
            //     })
            //     if (res.meta.status !== 200) {
            //         return this.$message.error('获取用户列表失败！')
            //     }
            //     this.userList = res.data.users
            //     this.total = res.data.total
            //     console.log(res)
            // },
            getuserList() {
                this.$http.get('users', {
                    params: this.queryInfo
                }).then(res => {
                    // console.log(res);
                    if (res.data.meta.status !== 200) {
                        return this.$message.error('获取用户列表失败！')
                    }
                    this.userList = res.data.data.users
                    this.total = res.data.data.total
                    // console.log(this.userList);
                })
            },
            // 监听pagesize值改变
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getuserList();

            },
            // 监听页码值改变
            handleCurrentChange(currentSize) {
                this.queryInfo.pagenum = currentSize
                this.getuserList();
            },
            // 向后台保存状态
            changeState(e) {
                console.log(e);
                console.log(e.mg_state);
                this.$http.put('users/' + e.id + '/state/' + e.mg_state).then(res => {
                    // console.log(res);
                    if (res.data.meta.status == 200) {
                        this.$message({
                            showClose: true,
                            message: res.data.meta.msg,
                            type: 'success',
                            duration: 1000
                        });
                    } else {
                        e.mg_state = !e.mg_state
                        this.$message({
                            showClose: true,
                            message: res.data.meta.msg,
                            type: 'error',
                            duration: 1000
                        });

                    }
                })
            },
            closeDailog() {
                // console.log(this);
                this.$refs.ruleValue.resetFields()
            },
            editCloseDailog() {
                this.$refs.editruleValue.resetFields()
            },
            addUser() {
                this.$refs.ruleValue.validate(async valid => {
                    // console.log(valid);
                    if (!valid) return
                    this.$http.post('users', this.addForm).then(res => {
                        console.log(res);
                        if (res.status == 200) {
                            this.$message.success('添加用户成功')
                            this.dialogVisible = false;
                            this.getuserList();
                        } else {
                            this.$message.error('添加用户失败')
                        }
                    })
                })
            },
            // 修改用户对话框
            showEditDailog(e) {
                this.uid = e.id
                this.$http.get('users/' + e.id).then(res => {
                    // console.log(res);
                    if (res.data.meta.status == 200) {
                        // console.log(res.data.data.username);
                        this.editForm = res.data.data
                        this.editDialogVisible = true;
                    } else {
                        this.$message.error('查询用户失败')
                    }
                })
            },
            // 修改用户
            editUser() {
                this.$refs.editruleValue.validate(async valid => {
                    // console.log(valid);
                    if (!valid) return
                    this.$http.put('users/' + this.editForm.id, this.editForm).then(res => {
                        // console.log(res);
                        if (res.status == 200) {
                            this.$message.success('修改用户成功')
                            this.editDialogVisible = false;
                            this.getuserList();
                        } else {
                            this.$message.error('修改用户失败')
                        }
                    })
                })
            },
            deleteUser(uid) {
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete('users/'+uid).then(res => {
                        // console.log(res);
                        if (res.status == 200) {
                            this.$message.success('删除用户成功')
                            this.getuserList();
                        } else {
                            this.$message.error('删除用户失败')
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }

    }
</script>
<style lang="less" scoped>
    .el-breadcrumb {
        margin-bottom: 15px;
        font-size: 12px;
    }

    .el-card {
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
    }

    .el-table {
        margin-top: 15px;
        font-size: 12px;
    }

    .el-pagination {
        margin-top: 10px;
    }
</style>