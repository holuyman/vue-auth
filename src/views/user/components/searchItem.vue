<template>
  <div>
    <div class="user-table-head">
      <!-- <el-button icon="el-icon-edit" @click="editUser"></el-button> -->
      <el-button icon="el-icon-my-add-user" @click="addUser">添加</el-button>
      <el-button icon="el-icon-my-del" @click="delHistoryList">批量删除</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'searchItem',
  data() {
    return {
      search_data: {
        startTime: '',
        endTime: '',
        name: '',
      },
      rules: {
        name: [{ required: true, message: '请输入用户名', tigger: 'blue' }],
      },
    }
  },
  computed: {},
  methods: {
    delHistoryList() {
      //删除选中的历史数据
      // this.delVisible = true;
      // const length = this.multipleSelection.length;
      // console.log(this.multipleSelection);
      // for (let i = 0; i < length; i++) {
      //     this.delarr.push(this.multipleSelection[i].taskId);
      // }
      this.$emit('onBatchDelUser')
    },
    // editUser() {
    //       const length = this.multipleSelection.length;

    //       this.form = {
    //           name: this.multipleSelection[0].name,
    //           username: this.multipleSelection[0].userName,
    //           password: this.multipleSelection[0].password,
    //           confimpassword: "",
    //           telnum: this.multipleSelection[0].telNum
    //       };
    //       console.log(this.form);
    //       this.editVisible = true;
    //       this.userInfoDiv = "编辑用户";
    //   },
    addUser() {
      // this.editVisible = true;
      // this.form = {
      //     name: "",
      //     username: "",
      //     password: "",
      //     confimpassword: "",
      //     telnum: ""
      // };
      // console.log(this.form);
      // this.editVisible = true;
      // this.userInfoDiv = "添加用户";
      // user.addUser
      this.$emit('showDialog', 'add')
    },
  },
}
</script>
<style scoped>
.user-table-head {
  float: right;
  height: 50px;
  width: 100%;
}
.user-table-head button {
  float: right;
  margin-right: 5px;
  /* padding: 0;
  border: none; */
}
</style>
