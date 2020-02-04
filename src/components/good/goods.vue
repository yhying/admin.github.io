<template lang="">
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div>
                        <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable
                            @input="getgoodList()" @clear="getgoodList()">
                            <el-button slot="append" icon="el-icon-search" @click="getgoodList()"></el-button>
                        </el-input>
                    </div>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addGood()">添加商品</el-button>
                </el-col>
            </el-row>
            <el-table :data="goodList" style="width: 100%" border stripe max-height="450px">
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column prop="goods_name" label="商品名称" class="goodName">
                </el-table-column>
                <el-table-column prop="goods_price" label="商品价格(元)" width="70px">
                </el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="70px">
                </el-table-column>
                <el-table-column prop="add_time" label="创建时间" width="160px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDailog(scope.row)">
                        </el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区间 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15,20]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total" background>
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                total:0,
                queryInfo: {
                    query: '',
                    // 当前的页数
                    pagenum: 1,
                    // 当前每页显示多少条数据
                    pagesize: 10
                },
                goodList: [],
            }
        },
        created() {
            this.getgoodList()
        },
        methods: {
            getgoodList() {
                this.$http.get('goods', {
                    params: this.queryInfo
                }).then(res => {
                    // console.log(res);
                    if (res.data.meta.status === 200) {
                        this.goodList = res.data.data.goods
                        this.total = res.data.data.total
                    }
                })
            },
            handleSizeChange(e) {
                this.queryInfo.pagesize=e
                this.getgoodList()
            },
            handleCurrentChange(e) {
                this.queryInfo.pagenum=e
                this.getgoodList()
            },
            addGood(){
                this.$router.push('/goods/add')
            }
        },
    }
</script>
<style lang="less" scoped>
    .goodName {
        font-size: 12px !important;
    }
</style>