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
                            <el-button type="warning" icon="el-icon-s-tools" size="mini"
                                @click="choosePower(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限 -->
        <el-dialog title="分配权限" :visible.sync="dialogVisible" width="50%">
            <el-tree :data="powerList" :props="defaultProps" show-checkbox node-key="id"
                default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                roleList: [],
                dialogVisible: false,
                powerList: '',
                defaultProps: {
                    children: 'children',
                    label: 'authName'
                },
                defKeys: [],
                uid:''
            }
        },
        created() {
            this.getroleList();
        },
        methods: {
            getroleList() {
                this.$http.get('roles').then(res => {
                    // console.log(res);
                    if (res.status == 200) {
                        this.roleList = res.data.data
                    } else {
                        this.$message.error('获取数据失败')
                    }
                })
            },
            deleteTag(e, id) {
                // console.log(e, id);
                this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete('roles/' + e.id + '/rights/' + id).then(res => {
                        console.log(res);
                        if (res.status == 200) {
                            // this.getroleList();
                            e.children = res.data.data
                            this.$message({
                                type: 'success',
                                message: '删除成功!',
                                duration: 1000
                            });
                        } else {
                            this.$message.error('删除失败')
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
            // 分配权限
            choosePower(e) {
                // console.log(e.id);
                this.uid=e.id
                this.defKeys=[]
                this.getderKeys(e,this.defKeys);
                // console.log(this.defKeys);
                this.dialogVisible = true;
                this.$http.get('rights/tree').then(res => {
                    // console.log(res);
                    if (res.data.meta.status == 200) {
                        this.powerList = res.data.data
                        // console.log(this.powerList);
                    } else {
                        this.$message({
                            type: 'warning',
                            message: '获取权限失败!',
                            duration: 1000
                        });
                    }
                })
            },
            // 递归取出三级分类的id
            getderKeys(node,arr) {
                // console.log(node.id);
                if(!node.children){
                    // console.log(node.id);
                return arr.push(node.id)
                }
                node.children.forEach(item=>{
                    this.getderKeys(item,arr)
                })
            },
            addUser(){
                const keys=[
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]
                const strkeys=keys.join(',')
                console.log(strkeys);
                this.$http.post('roles/'+this.uid+'/rights',{rids:strkeys}).then(res => {
                    // console.log(res);
                    if (res.data.meta.status == 200) {
                        this.$message({
                            type: 'success',
                            message: '更改权限成功!',
                            duration: 1000
                        });
                        this.dialogVisible=false;
                        this.getroleList()
                         
                    } else {
                        this.$message({
                            type: 'warning',
                            message: '更改权限失败!',
                            duration: 1000
                        });
                    }
                })
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