<template>
    <div >
        
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" >
            <el-form-item label=" " prop=" ">
                <!-- <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input> -->
            </el-form-item>
            <el-form-item label="旧密码" prop="oldPass" >
                <el-input type="password" v-model.number="ruleForm.oldPass" autocomplete="off" style="width: 300px;"></el-input>
            </el-form-item>
            <!-- <el-form-item label="确认密码" prop="checkPass"></el-form-item> -->
            <el-form-item label="密码" prop="pass">
                <el-input type="password" v-model="ruleForm.pass" autocomplete="off" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" style="width: 300px;"></el-input>
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { UserResetUserPassWord } from '@/api'
export default {
    data() {
        var checkoldPass = (rule, value, callback) => {
            if (value === '') {
                return callback(new Error('旧密码不能为空'));
            } else {
                if (this.ruleForm.checkPass !== '') {
                    this.$refs.ruleForm.validateField('checkPass');
                }
                callback();
            }
            // setTimeout(() => {
            //     if (!Number.isInteger(value)) {
            //         callback(new Error('请输入数字值'));
            //     } else {
            //         if (value < 18) {
            //             callback(new Error('必须年满18岁'));
            //         } else {
            //             callback();
            //         }
            //     }
            // }, 1000);
        };
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.ruleForm.checkPass !== '') {
                    this.$refs.ruleForm.validateField('checkPass');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm.pass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            ruleForm: {
                pass: '',
                checkPass: '',
                oldPass: ''
            },
            rules: {
                pass: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ],
                oldPass: [
                    { validator: checkoldPass, trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // alert('submit!');
                    // console.log(this.$store.state.name);
                    UserResetUserPassWord({
                        name:this.$store.state.userName,
                        oldPassword:this.ruleForm.oldPass,
                        newPassword:this.ruleForm.pass
                    }).then((response)=>{
                        if (response.data.code == 1){
                            this.$notify({
                                title: '成功',
                                message: '修改密码成功！',
                                type: 'success'
                            });
                        }else{
                            this.$notify.error({
                                title: '错误',
                                message: '修改密码失败，请检查旧密码和用户名是否正确。'
                            });
                        }
                        
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>

<style lang="less" scoped>

</style>