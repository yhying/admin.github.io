<template lang="">
    <div class="contanier">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-button type="primary">添加角色</el-button>
            <el-table :data="roleList" border stripe max-height="490px">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :gutter="20" :class="['bdbottom','vcenter',i==0?'bdtop':' ']"
                            v-for="(item ,i) in scope.row.children">
                            <el-col :span="5">
                                <el-tag closable>{{item.authName}}</el-tag>
                                <i class="el-icon-caret-right
                                "></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                                    v-for="(item2, i2) in item.children">
                                    <el-col :span="8">
                                        <el-tag type="success" closable>{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right
                                                "></i>
                                    </el-col>
                                    <el-col :span="16">
                                        <el-tag type="warning" v-for="(item3,i) in item2.children" closable
                                            @close="deleteTag(scope.row, item3.id)">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column prop="roleName" label="角色名称">
                </el-table-column>
                <el-table-column prop="roleDesc" label="角色描述">
                </el-table-column>
                <el-table-column label="角色操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDailog(scope.row)">
                        </el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)">
                        </el-button>
                        <el-tooltip class="item" effect="dark" content="设置角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-s-tools" size="mini"></el-button>
                        </el-tooltip>
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
                roleList: []
            }
        },
        created() {
            this.getroleList();
        },
        methods: {
            getroleList() {
                this.$http.get('roles').then(res => {
                    console.log(res);
                    if (res.status == 200) {
                        this.roleList = res.data.data
                        // console.log(this.rightList);
                    } else {
                        this.$message.error('获取数据失败')
                    }
                })
            },
            deleteTag(e, id) {
                console.log(e, id);
                this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete('roles/' + e.id + '/rights/' + id).then(res => {
                        console.log(res);
                        if (res.status == 200) {
                            // this.getroleList();
                            e.children=res.data.data
                            this.$message({
                                type: 'success',
                                message: '删除成功!',
                                duration:1000
                            });
                        } else {
                            this.$message.error('删除失败')
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                        duration:1000
                    });
                });
            }
        },
    }
</script>
<style lang="less" scoped>
    .el-table {
        /* max-height: 60%; */
        margin-top: 15px;
    }

    .el-breadcrumb {
        margin-bottom: 15px;
        font-size: 12px;
    }

    .el-card {
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
    }

    .bdtop {
        border-top: 1px solid #eee;
    }

    .bdbottom {
        border-bottom: 1px solid #eee;
    }

    .el-tag {
        margin: 7px;
    }

    .vcenter {
        display: flex;
        align-items: center;
    }
</style>