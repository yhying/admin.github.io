<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
            </el-alert>
            <el-steps :space="200" :active="activeIndex -0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form :model="addgoodsForm" :rules="addgoodsrules" ref="ruleForm" label-width="100px"
                label-position="top">
                <el-tabs v-model="activeIndex" :tab-position="tabPosition">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addgoodsForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addgoodsForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addgoodsForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addgoodsForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader expand-trigger="hover" :options="cateList" :props="cateProps"
                                v-model="addgoodsForm.goods_cat" @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                activeIndex: 0,
                tabPosition: 'left',
                cateList: [],
                addgoodsForm: {
                    goods_name: '',
                    goods_price: '',
                    goods_weight: '',
                    goods_number: '',
                    goods_cat:[]
                },
                addgoodsrules: {
                    goods_name: [{
                        required: true,
                        message: '请输入商品名称',
                        trigger: 'blur'
                    }],
                    goods_price: [{
                        required: true,
                        message: '请输入商品价格',
                        trigger: 'blur'
                    }],
                    goods_weight: [{
                        required: true,
                        message: '请输入商品重量',
                        trigger: 'blur'
                    }],
                    goods_number: [{
                        required: true,
                        message: '请输入商品数量',
                        trigger: 'blur'
                    }],
                    goods_cat: [{
                        required: true,
                        message: '请选择商品分类',
                        trigger: 'blur'
                    }]
                },
                cateProps: {
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children'
                }
            }
        },
        created() {
            this.getcateList()
        },
        methods: {
            getcateList() {
                this.$http.get('categories').then(res => {
                    if (res.data.meta.status !== 200) {
                        return this.$message.error('获取商品分类数据失败！')
                    }
                    this.cateList = res.data.data
                    // console.log(this.cateList);
                })
            },
            handleChange(e) {
                console.log(e);
            }
        },
    }
</script>
<style lang="less">
    .el-steps {
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .el-step__title {
        font-size: 14px !important;
    }

    .el-input {
        /* padding:0 20px; */
        box-sizing: border-box;
    }

    .el-tabs {
        max-height: 420px;
        overflow-y: auto !important;
    }
</style>