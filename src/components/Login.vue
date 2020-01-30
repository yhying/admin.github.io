<template>
    <div class="login">
        <div class="box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单区域 -->
            <el-form ref="loginFormRef" :model="loginFrom" :rules="loginRules" class="login_from">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user" v-model=loginFrom.username></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model=loginFrom.password>
                    </el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-from-item class="btns">
                    <el-button type="primary" @click="Tologin">登录</el-button>
                    <el-button type="info" @click="resetLoginfrom">重置</el-button>
                </el-from-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                loginFrom: {
                    username: 'admin',
                    password: '123456'
                },
                //表单验证规则
                loginRules: {
                    //验证用户名
                    username: [{
                            required: true,
                            message: '请输入登录名称',
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
                            message: '请输入登录密码',
                            trigger: 'blur'
                        },
                        {
                            min: 6,
                            max: 15,
                            message: '长度在 6 到 15 个字符',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        methods: {
            // 点击重置按钮，重置登录表单
            resetLoginfrom() {
                // console.log(this)
                this.$refs.loginFormRef.resetFields()
            },
            Tologin() {
                this.$refs.loginFormRef.validate(async valid => {
                    // console.log(valid);
                    if (!valid)
                        return;
                    this.$http.post('login', this.loginFrom).then(res => {
                        // console.log(res.data);
                        if (res.data.meta.status == 200) {
                            this.$message.success(res.data.meta.msg)
                            // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
                            //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
                            //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
                            sessionStorage.setItem('token', res.data.data.token)
                            // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
                            this.$router.push('/home')

                        } else {
                            this.$message.error(res.data.meta.msg)
                        }
                    })
                    // 此方法报后台参数错误
                    // const res= await this.$http.post('login', this.loginForm)
                    // console.log(res);
                    // if (res.meta.status !== 200) return this.$message.error('登录失败！')
                    // this.$message.success('登录成功')
                    // console.log(res);
                })
            },
        }
    }
</script>
<style lang="less" scoped>
    .login {
        background-color: #2b4b6b;
        height: 100%;

        .box {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 450px;
            height: 300px;
            background-color: #fff;
            border-radius: 3px;

            .avatar_box {
                position: absolute;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 130px;
                height: 130px;
                border: 1px solid #eee;
                border-radius: 50%;
                padding: 10px;
                background-color: #fff;
                box-shadow: 0 0 10px #ddd;

                img {
                    width: 100%;
                    border-radius: 50%;
                    background-color: #EEE;

                }
            }

            .btns {
                display: flex;
                justify-content: flex-end;
            }

            .login_from {
                position: absolute;
                bottom: 0;
                width: 100%;
                padding: 20px;
                box-sizing: border-box;
            }
        }
    }
</style>