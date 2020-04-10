<template>
  <div class="bg">

    <addFunDialog v-if="addFundDialog.show" :isShow="addFundDialog.show" :dialogRow="addFundDialog.dialogRow"
      @getFundList="getData" @closeDialog="hideAddFundDialog" :addFundDialog="addFundDialog"></addFunDialog>
    <div class="userManage-table">
      <search-item @showDialog="showAddFunDialog" @onBatchDelUser="onBatchDelUser"></search-item>

      <el-table ref="multipleTable" :data="userData" tooltip-effect="dark" highlight-current-row style="width: 100%"
        @selection-change="handleSelectionChange" @current-change="currentSelection" class="userManage_table">
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column prop="username" align="center" label="用户名"></el-table-column>
        <el-table-column prop="password" align="center" label="密码"></el-table-column>
        <el-table-column prop="name" align="center" label="姓名"></el-table-column>
        <el-table-column prop="telnum" align="center" label="电话号码"></el-table-column>
        <el-table-column prop="comments" align="center" label="备注"></el-table-column>
        <el-table-column prop="operation" align="center" label="操作" width="240">
          <template slot-scope="scope">

            <el-button type="warning" icon="edit" size="mini" @click="onEditUser(scope.row)">编辑</el-button>
            <el-button type="danger" icon="delete" size="mini" @click="onDeleteUser(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="user-pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          layout="total,sizes,prev,pager,next,jumper" :total="total" :current-page="initPageData.currentPage"
          :page-sizes="[10,20,100]" :page-size="initPageData.pageSize"></el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
import AddFunDialog from './components/addFunDialog'
import SearchItem from './components/searchItem'
import { getUserList, removeUser, batchDelUser } from '@/api/user.js'
export default {
  name: 'userManage',
  data() {
    return {
      dialogVisible: false,
      form: {
        name: '',
        username: '',
        password: '',
        confimpassword: '',
        telnum: '',
      },
      search: '',
      editVisible: false,
      userData: [],
      multipleSelection: [], //选中的行
      initPageData: {
        currentPage: 1,
        pageSize: 10,
      },
      total: 0,

      gridData: [
        { date: '2016-05-02', name: '123' },
        { date: '2016-05-02', name: '123' },
        { date: '2016-05-02', name: '123' },
        { date: '2016-05-02', name: '123' },
      ],
      dialogTableVisible: false,
      delarr: '',
      userInfoDiv: '',
      addFundDialog: {
        show: false,
        title: '',
        type: '新增用户',
        dialogRow: {},
      },
    }
  },
  created() {},
  mounted() {
    this.getData()
  },
  components: {
    SearchItem,
    AddFunDialog,
  },
  computed: {
    routesData() {
      return this.routes
    },
  },
  methods: {
    currentSelection(rows) {
      console.log(rows)
      this.userData.forEach(item => {
        if (item.userId != rows.userId) {
          item.checked = false
        }
      })
      // if (rows) {
      //     rows.forEach(row => {
      //         this.$refs.multipleTable.toggleRowSelection(row);
      //     });
      // } else {
      //     this.$refs.multipleTable.clearSelection();
      // }
    },
    //显示弹框
    showAddFunDialog(type) {
      // this.$store.commit('SET_DIALOG_TITLE', type)
      // debugger
      if (type == 'add') {
        this.addFundDialog.title = '添加用户'
      } else {
        this.addFundDialog.title = '编辑用户'
      }

      this.addFundDialog.type = type
      this.addFundDialog.show = true
    },
    hideAddFundDialog() {
      this.addFundDialog.show = false
    },
    handleSelectionChange(val) {
      // console.log(val);
      // console.log(this.multipleSelection)
      this.multipleSelection = val
      // console.log(this.multipleSelection)
      // if (val.length) {
      //     rows.forEach(row => {
      //         this.$refs.multipleTable.toggleRowSelection(row);
      //     });
      // } else {
      //     this.$refs.multipleTable.clearSelection();
      // }
      // this.userData.forEach(item=>{
      //   if(item.userId!=val.userId){
      //     item.checked=false;
      //   }
      // })
    },
    //批量删除
    onBatchDelUser() {
      // console.log(this.multipleSelection)
      const length = this.multipleSelection.length
      if (length == 0) {
        this.$message.error('请选择要删除的用户！')
        return
      } else {
        this.$confirm('确认删除选中的用户吗？', '提示', {
          type: 'wraning',
        })
          .then(() => {
            for (let i = 0; i < length; i++) {
              // console.log(this.multipleSelection[i].id)
              if (i == 0) {
                this.delarr = this.multipleSelection[i].id
              } else {
                this.delarr = this.delarr + '-' + this.multipleSelection[i].id
              }
            }
            const para = this.delarr
            batchDelUser(para).then(res => {
              this.$message({
                message: '删除成功',
                type: 'success',
              })
              this.getData()
            })
          })
          .catch(() => {})
      }
    },

    onDeleteUser(row) {
      this.$confirm('确认删除该记录吗？', '提示', {
        type: 'wraning',
      })
        .then(() => {
          const para = { id: row.id }
          removeUser(para).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success',
            })
            this.getData()
          })
        })
        .catch(() => {})
    },
    //编辑权限
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        const routes = this.generateRoutes(this.role.routes)
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) {
          continue
        }

        const onlyOneShowingChild = this.onlyOneShowingChild(
          route.children,
          route,
        )

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title,
        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    getData() {
      const parms = {
        pageSize: this.initPageData.pageSize,
        currentPage: this.initPageData.currentPage,
        search: this.search,
      }
      // // get(params).then(res=>{
      // this.total = this.userData.length;
      // })
      console.log(parms)
      getUserList(parms).then(res => {
        console.log(res)
        this.loading = false
        this.total = res.total
        this.userData = res.data
        // console.log(this.userData)
      })
    },

    //列表分页
    handleSizeChange: function(pageSize) {
      console.log('handleSizeChange')
      this.initPageData.pageSize = pageSize
      this.handleCurrentChange(this.initPageData.currentPage)
    },
    handleCurrentChange: function(currentPage) {
      console.log('handleCurrentChange')
      this.initPageData.currentPage = currentPage
      this.getData()
      // this.handleCurrentChange(this.tableData, currentPage);
    },
    //分页方法
    currentChangePage(list, currentPage) {
      console.log('currentChangePage')
      // let from =(currentPage-1)*this.pageSize;
      // let to=currentPage*this.pageSize;
      // this.tempList=[];
      // for(;from<to;from++){
      //   if(list[from]){
      //     this.tempList.push(list[from])
      //   }
      // }
    },
    viewData(index, row) {
      this.dialogTableVisible = true
      console.log(index, row)
    },
    onEditUser(row) {
      this.addFundDialog.dialogRow = row
      this.addFundDialog.type = 'edit'
      this.showAddFunDialog('edit')
    },
  },
}
</script>
<style scoped lang="scss">
.el-radio-group label {
  display: block;
  line-height: 27px;
}
.userManage-table {
  margin: 44px 320px;
  border: 1px solid #ccc;
  border-radius: 14px;
  padding: 7px 21px 55px;
  height: 720px;
  background: rgba(255, 255, 255, 0.6);
  .userManage_table {
    height: 95%;
  }
}

.user-table-head {
  text-align: right;
  padding-bottom: 5px;
}
.user-table table th,
.user-table table tr {
  background-color: #f1f8fe;
}
.el-table__row {
  background-color: #f1f8fe;
}
</style>
