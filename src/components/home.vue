<template lang="">
    <el-container class="home-container">
        <el-header>
            <div class="left">
                <img src="../assets//heima.png" alt="">
                <span>电商管理系统</span>
            </div>
            <el-button type="info" @click="returnLogin()">退出</el-button>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-menu default-active="2" v-for="(item,i) in asideList" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
                    background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened >
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <el-menu-item index="1-2" v-for="subitem in item.children">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>{{subitem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>
<script>
    export default {
        data() {
            return {
                asideList:[]
            }
        },
        created() {
            this.getAsideList()
        },
        methods: {
            returnLogin() {
                sessionStorage.clear('token')
                this.$router.push('/login')
            },
            getAsideList(){
                this.$http.get('menus').then(res => {
                        // console.log(res);
                        if (res.data.meta.status == 200) {
                            this.asideList=res.data.data
                            console.log(this.asideList);
                        }else {
                            this.$message.error(res.data.meta.msg)
                        }
                    })
            }

        },

    }
</script>
<style lang="less" scoped>
    .home-container {
        height: 100%;
        color: #fff;
    }

    .el-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 0;
        background-color: #373d41;

        .left {
            display: flex;
            align-items: center;
            font-size: 20px;

            span {
                margin-left: 10px;
            }
        }
    }

    .el-aside {
        background-color: #333744;
    }

    .el-main {
        background-color: #eaedf1;
    }
</style>