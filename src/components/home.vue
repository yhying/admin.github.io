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
            <el-aside :width="isCollapse?'64px':'200px'">
                <!-- 隐藏展示菜单栏 -->
                <div class="toggle-tab" @click="getToggle">|||</div>
                <!-- 侧边栏菜单区域 -->
                <el-menu class="el-menu-vertical-demo" background-color="#373744" text-color="#fff"
                    active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router
                    :default-active="activePath">
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id+' '" v-for="(item,i) in asideList">
                        <template slot="title">
                            <i :class="iconList[item.id]" class="iconfont"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children"
                            @click="keepActive('/'+subitem.path)">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subitem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    export default {
        data() {
            return {
                asideList: [],
                iconList: {
                    '125': 'iconfont icon-user',
                    '103': 'iconfont icon-tijikongjian',
                    '101': 'iconfont icon-shangpin',
                    '102': 'iconfont icon-danju',
                    '145': 'iconfont icon-baobiao'
                },
                // 是否折叠
                isCollapse: false,
                activePath: ''
            }
        },
        created() {
            this.getAsideList()
            this.activePath=window.sessionStorage.getItem('active')
        },
        methods: {
            returnLogin() {
                sessionStorage.clear('token')
                this.$router.push('/login')
            },
            getAsideList() {
                this.$http.get('menus').then(res => {
                    // console.log(res);
                    if (res.data.meta.status == 200) {
                        this.asideList = res.data.data
                        // console.log(this.asideList);
                    } else {
                        this.$message.error(res.data.meta.msg)
                    }
                })
            },
            getToggle() {
                this.isCollapse = !this.isCollapse;
            },
            keepActive(path) {
                // console.log(path);
                window.sessionStorage.setItem('active',path)
                this.activePath=path
            }

        }
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

        .el-menu {
            border-right: none;
        }

        .toggle-tab {
            background-color: #4a5064;
            text-align: center;
            font-size: 10px;
            line-height: 24px;
            letter-spacing: 0.2em;
            cursor: pointer;
        }
    }

    .el-main {
        background-color: #eaedf1;
    }

    .iconfont {
        margin-right: 10px;
    }
</style>