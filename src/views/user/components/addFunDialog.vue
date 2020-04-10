<template>
  <div>
    <el-dialog :title="addFundDialog.title" :visible.sync="isVisible" center @close="closeDialog"
      :append-to-body="true">
      <el-form :model="form" ref="form" :rules="form_rules" :label-width="dialog.formLabelWidth">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="form.username" auto-complete="off" :disabled="isDisabled"></el-input>
        </el-form-item>
        <el-form-item prop="password" type="pass" label="密码">
          <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="confimpassword" type="pass" label="确认密码">
          <el-input type="password" v-model="form.confimpassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="姓名">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="telnum" label="电话">
          <el-input v-model="form.telnum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop='role' label="角色">
          <el-radio-group v-model="radio">

            <!-- {{radios}} -->
            <el-radio :label="ra.id" v-for="(ra,i) in radios" :key="i">{{ra.name}}</el-radio>
            <!-- <el-radio :label="3">admin</el-radio>
            <el-radio :label="6">editor</el-radio>
            <el-radio :label="9">visitor</el-radio> -->
          </el-radio-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isVisible=false">取消</el-button>
        <el-button type="primary" @click="onSubmit('form')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { mapState, mapGetters } from 'vuex'
import { addUser, updateUser } from '@/api/user'
import { getRoles } from '@/api/role'
export default {
  name: 'addFundDialogs',
  data() {
    let validateData = (rule, value, callback) => {
      if (value === '') {
        let text
        if (rule.field == 'name') {
          text = '姓名'
        } else if (rule.field == 'username') {
          text = '用户名'
        } else if (rule.field == 'password') {
          text = '密码'
        } else if (rule.field == 'telnum') {
          text = '电话'
        }
        callback(new Error(text + '不能为空'))
      } else {
        console.log(value)
        // let numReg = /^[0-9]+.?[0-9]*$/
        if (rule.field === 'telnum') {
          var regtel = /^1[3456789]\d{9}$/
          if (!regtel.test(value)) {
            callback(new Error('请输入有效的手机号'))
          } else {
            callback()
          }
        } else if (rule.field === 'username') {
          const regUser = /^[a-zA-Z][a-zA-Z0-9]{5,15}$/
          if (!regUser.test(value)) {
            callback(
              new Error('用户名格式不正确(必须以字母开头,长度至少为6位)'),
            )
          } else {
            callback()
          }
        } else if (rule.field === 'password') {
          const reg = /^[\S]{6,15}/
          if (!reg.test(value)) {
            callback(new Error('密码至少为6位'))
          } else {
            callback()
          }
        } else if (rule.field === 'confimpassword') {
          callback()
        } else {
          callback()
        }
        // callback()
      }
    }
    return {
      isVisible: this.isShow,
      isDisabled: false,
      radios: [],
      radio: 3,
      form: {
        name: '',
        username: '',
        password: '',
        confimpassword: '',
        telnum: '',
        radio: 3,
      },
      form_rules: {
        username: [
          {
            required: true,
            validator: validateData,
            // message:'用户名不能为空',
            tirgger: 'blur',
          },
        ],
        name: [
          {
            required: true,
            validator: validateData,
            tirgger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            validator: validateData,
            tirgger: 'blur',
          },
        ],
        telnum: [
          {
            required: true,
            validator: validateData,
            tirgger: 'blur',
          },
        ],
        confimpassword: [
          {
            required: true,
            validator: validateData,
            // message:'确认密码不能为空',
            tirgger: 'blur',
          },
        ],
      },
      //详情弹框信息
      dialog: {
        width: '400px',
        formLabelWidth: '120px',
      },
    }
  },
  props: {
    isShow: Boolean,
    dialogRow: Object,
    addFundDialog: Object,
  },
  computed: {
    // ...mapGetters(['addFundDialog']),
  },
  created() {
    this.getRoles()
    this.$nextTick(() => {
      const _this = this
      if (_this.addFundDialog.type === 'edit') {
        _this.isDisabled = true
        _this.form = _this.dialogRow
        _this.form.confimpassword = _this.form.password

        _this.radio = parseInt(this.dialogRow.roles)

        // this.form = {
        //         name: this.multipleSelection[0].name,
        //         username: this.multipleSelection[0].userName,
        //         password: this.multipleSelection[0].password,
        //         confimpassword: "",
        //         telnum: this.multipleSelection[0].telNum
        //     };
      } else {
        _this.isDisabled = false
        _this.radio = 2
        // console.log(this.$refs['form'])
        if (_this.$refs['form']) _this.$refs['form'].resetFields()
      }
    })
  },
  mounted() {},
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    },
    //获取所有角色
    getRoles() {
      getRoles().then(res => {
        // const _this = this

        // console.log(this.radio)

        this.radios = res.data
      })
    },
    onSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          //表单验证完成之后，提交数据
          let formData = this[form]
          const para = Object.assign({}, formData)

          //edit
          if (this.addFundDialog.type === 'edit') {
            updateUser(para).then(res => {
              this.$message({
                message: '修改成功',
                type: 'success',
              })
              this.$refs['form'].resetFields()
              this.isVisible = false
              this.$emit('getFundList')
            })
          } else {
            //add
            addUser(para).then(res => {
              this.$message({
                message: '添加成功',
                type: 'success',
              })
              this.$refs['form'].resetFields()
              this.isVisible = false
              this.$emit('getFundList')
            })
          }
        }
      })
    },
  },
}
</script>
<style scoped>
</style>

