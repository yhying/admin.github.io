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
            <el-form :model="addgoodsForm" :rules="addgoodsrules" ref="addruleForm" label-width="100px"
                label-position="top">
                <el-tabs v-model="activeIndex" :tab-position="tabPosition" :before-leave="beforeTabLeave"
                    @tab-click="tabClicked">
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
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="item" v-for="item in item.attr_vals" border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload class="upload-demo" :action="uploadURL" :on-preview="handlePreview"
                            :on-remove="handleRemove" :on-success="hanldeSuccess" list-type="picture"
                            :headers="headerObj">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本区域 -->
                        <quill-editor></quill-editor>
                        <!-- 添加商品的按钮 -->
                        <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>
<script>
    import _ from 'lodash'
    export default {
        data() {
            return {
                activeIndex: 0,
                tabPosition: 'left',
                cateList: [],
                addgoodsForm: {
                    goods_name: '',
                    goods_price: 999,
                    goods_weight: 111,
                    goods_number: 99,
                    goods_cat: [],
                    // 图片的数组
                    pics: [],
                    // 商品的详情描述
                    goods_introduce: '',
                    attrs: []
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
                },
                // 动态参数列表数据
                manyTableData: [],
                // 静态属性列表数据
                onlyTableData: [],
                // 上传图片的URL地址
                uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
                headerObj: {
                    Authorization: window.sessionStorage.getItem('token')
                },
                previewVisible: false,
                previewPath: ''

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
                // console.log(e);
                if (this.addgoodsForm.goods_cat.length !== 3) {
                    this.addgoodsForm.goods_cat = []
                }
            },
            beforeTabLeave(activeName, oldActiveName) {
                // console.log('即将离开的标签页名字是：' + oldActiveName)
                // console.log('即将进入的标签页名字是：' + activeName)
                // return false
                if (oldActiveName === '0' && this.addgoodsForm.goods_cat.length !== 3) {
                    this.$message.error('请先选择商品分类！')
                    return false
                }
            },
            tabClicked() {
                // console.log(this.activeIndex)
                // 证明访问的是动态参数面板
                if (this.activeIndex === '1') {
                    this.$http.get(
                        `categories/${this.cateId}/attributes`, {
                            params: {
                                sel: 'many'
                            }
                        }
                    ).then(res => {
                        if (res.data.meta.status !== 200) {
                            return this.$message.error('获取动态参数列表失败！')
                        }
                        console.log(res.data.data)
                        res.data.data.forEach(item => {
                            item.attr_vals =
                                item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                        })
                        this.manyTableData = res.data.data
                    })
                } else if (this.activeIndex === '2') {
                    this.$http.get(
                        `categories/${this.cateId}/attributes`, {
                            params: {
                                sel: 'only'
                            }
                        }
                    ).then(res => {
                        if (res.data.meta.status !== 200) {
                            return this.$message.error('获取静态属性失败！')
                        }
                        console.log(res.data.data)
                        this.onlyTableData = res.data.data
                    })
                }
            },
            // 处理移除图片的操作
            handleRemove(file, fileList) {
                console.log(file, fileList);
                const filepath = file.response.data.tmp_path
                // 2. 从 pics 数组中，找到这个图片对应的索引值
                const i = this.addgoodsForm.pics.findIndex(item =>
                    item.pic === filepath
                )
                // 3. 调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
                this.addgoodsForm.pics.splice(i, 1)

            },
            // 处理图片预览效果
            handlePreview(file) {
                console.log(file);
                this.previewPath = file.response.data.url
                this.previewVisible = true;
            },
            // 图片上传成功
            hanldeSuccess(response, file, fileList) {
                // console.log(response);
                const picinfo = {
                    pic: response.data.tmp_path
                }
                this.addgoodsForm.pics.push(picinfo)
                console.log(this.addgoodsForm.pics);
            },
            // 添加商品
            add() {
                this.$refs.addruleForm.validate(valid => {
                    if (!valid) {
                        return this.$message.error('请完整填写商品信息')
                    }
                    // 执行添加的业务逻辑
                    // lodash   cloneDeep(obj)
                    const form = _.cloneDeep(this.addgoodsForm)
                    form.goods_cat = form.goods_cat.join(',')
                    // const form = this.addgoodsForm
                    // form.goods_cat = form.goods_cat.join(',')
                    // 处理动态参数
                    this.manyTableData.forEach(item => {
                        const newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals.join(' ')
                        }
                        this.addgoodsForm.attrs.push(newInfo)
                    })
                    // 处理静态属性
                    this.onlyTableData.forEach(item => {
                        const newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals
                        }
                        this.addgoodsForm.attrs.push(newInfo)
                    })
                    form.attrs=this.addgoodsForm.attrs
                    console.log(form);
                    console.log(this.manyTableData);
                    this.$http.post('goods',form).then(res=>{
                        if(res.data.meta.status!==201){
                            return this.$message.error('添加商品失败')
                        }
                        this.$message.success('添加商品成功！')
                        this.$router.push('/goods')
                    })
                })
            }
        },
        computed: {
            cateId() {
                if (this.addgoodsForm.goods_cat.length === 3) {
                    return this.addgoodsForm.goods_cat[2]
                }
                return null
            }
        }
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

    .el-checkbox {
        margin: 0 !important;
        margin-right: 10px !important;
    }

    .previewImg {
        width: 100%;
    }

    .btnAdd {
        margin-top: 15px !important;
    }
</style>