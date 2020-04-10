<template>
    <div class="bg">
        <my-header></my-header>
        <el-dialog title="提示" :visible.sync="delVisible" width="300" center>
                                <div class="del-dialog-cnt">删除不可恢复，是否确认删除？</div>
                                <span slot="footer" class="dialog-footer">
                                    <el-button @click="delVisible=false">取消</el-button>
                                    <el-button type="primary" @click="deleteRow">确定</el-button>
                                </span>
                            </el-dialog>
        <div class="user-table">
            <div class="user-table-head">
                <el-button icon="el-icon-my-del" @click="delHistoryList"></el-button>
            </div>
            
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                class="user_table"
            >
                <el-table-column type="selection" align="center" width="55"></el-table-column>
                <el-table-column prop="taskId" align="center" label="任务ID" width="150"></el-table-column>
                <el-table-column prop="taskName" align="center" label="任务名称" width="150"></el-table-column>
                <el-table-column label="创建时间" align="center" width="150">
                    <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>

                <el-table-column
                    label="数据类型"
                    align="center"
                    prop="checkList"
                    class-name="data-type"
                    width="500"
                >
                    <template slot-scope="scope">
                        <el-radio-group v-model="scope.row.taskId">
                            <!-- <el-option v-for="(typename,i) in scope.row.options" :key="i" :value="typename.typeName" :label="typename.typeName"></el-option> -->
                            <el-radio
                                v-for="(typename,i) in scope.row.checkList"
                                :label="typename.typeId"
                                :key="i"
                                name="type"
                            >{{typename.typeName}}</el-radio>
                        </el-radio-group>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="查看数据" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button :id="scope.row.taskId" @click="viewData(scope.$index,scope.row)" icon="el-icon-view"></el-button>
                        <el-dialog title="数据信息" :visible.sync="dialogTableVisible">
                          <el-table :data="gridData" title="收货地址">
                              <el-table-column property="date" label="日期" width="150"></el-table-column>
                              <el-table-column property="name" label="name" width="150"></el-table-column>
                          </el-table>
                        </el-dialog>
                    </template>
                </el-table-column>
            </el-table>
            <div class="user-pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    layout="total,sizes,prev,pager,next,jumper"
                    :total="total"
                    :current-page="currentPage"
                    :page-sizes="[10,20,100]"
                    :page-size="pageSize"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "user",
    data() {
        return {
            tableData: [
                {
                    taskId: "1",
                    taskName: "test01",
                    date: "2016-05-03",
                    name: "王小虎",
                    checkList: [
                        { typeId: "1", typeName: "各能道电子通量" },
                        { typeId: "2", typeName: "累计污染" }
                    ],
                    viewData: "1"
                },
                {
                    taskId: "2",
                    taskName: "test01",
                    date: "2016-05-02",
                    checkList: [
                        { typeId: "1", typeName: "各能道电子通量" },
                        { typeId: "2", typeName: "累计污染" }
                    ],
                    name: "王小虎",
                    viewData: "1"
                },
                {
                    taskId: "3",
                    taskName: "test01",
                    date: "2016-05-04",
                    checkList: [
                        { typeId: "1", typeName: "各能道电子通量" },
                        { typeId: "2", typeName: "累计污染" }
                    ],
                    name: "王小虎",
                    viewData: "1"
                }
            ],
            multipleSelection: [],
            total: 0,
            currentPage: 1,
            pageSize: 1,
            gridData:[{date:'2016-05-02',name:'123'},{date:'2016-05-02',name:'123'},{date:'2016-05-02',name:'123'},{date:'2016-05-02',name:'123'}],
            dialogTableVisible:false,
            delVisible:false,//删除提示框
            delarr:[]
        };
    },
    mounted(){
      this.getData();
    },
    methods: {
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delHistoryList() {
            //删除选中的历史数据
            this.delVisible = true;
            const length = this.multipleSelection.length;
            console.log(this.multipleSelection)
            for (let i = 0; i < length; i++) {
                this.delarr.push(this.multipleSelection[i].taskId);
            }
        },
        //确定删除
        deleteRow() {
          console.log(this.delarr)
            this.$axios
                .get("xxxxxxxx", {
                    params: {
                        delarr: this.delarr
                    }
                })
                .then(res => {
                    if (res.data == "删除成功") {
                        this.getPackData();
                        this.$message.success("删除成功");
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.$message.error("删除失败");
                });
            this.delVisible = false;
        },
        getData() {
            const parms = {
                pageSize: this.pageSize,
                currentPage: this.currentPage
            };
            // get(params).then(res=>{
            console.log(this.tableData.length);
            this.total = this.tableData.length;
            // })
        },
        //列表分页
        handleSizeChange: function(pageSize) {
            this.pageSize = pageSize;
            this.handleCurrentChange(this.currentPage);
        },
        handleCurrentChange: function(currentPage) {
            this.currentPage = currentPage;
            this.handleCurrentChange(this.tableData, currentPage);
        },
        //分页方法
        currentChangePage(list, currentPage) {
            // let from =(currentPage-1)*this.pageSize;
            // let to=currentPage*this.pageSize;
            // this.tempList=[];
            // for(;from<to;from++){
            //   if(list[from]){
            //     this.tempList.push(list[from])
            //   }
            // }
        },
        viewData(index,row){
          this.dialogTableVisible=true
          console.log(index,row)
        }
    }
};
</script>
<style scoped>
.el-radio-group label {
    display: block;
    line-height: 27px;
}
.user-table {
    margin: 44px 320px;
    border: 1px solid #ccc;
    border-radius: 14px;
    padding: 7px 21px 55px;
    height: 720px;
    background: rgba(255, 255, 255, 0.6);
}
.user-table .el-button {
    padding: 0;
    border: none;
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
