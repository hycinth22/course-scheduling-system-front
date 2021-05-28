<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 开课列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="query.semesterID" placeholder="选择学期" class="handle-select mr10">
          <el-option
              v-for="item in semesters"
              :key="item.start_date"
              :label="item.semester_name"
              :value="item.start_date">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-lx-forward" @click="importVisible=true" class="mr10">导入Excel</el-button>
        <el-input v-model="query.search" placeholder="课程编号/课程名/开课老师" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button
            type="danger"
            icon="el-icon-delete"
            class="handle-del mr10"
            @click="delAllSelection"
        >批量删除
        </el-button>
      </div>
      <el-table
          :data="tableData"
          border
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="course.id" label="课程编号" width="85" align="center"></el-table-column>
        <el-table-column prop="course.name" label="课程名"></el-table-column>
        <el-table-column prop="teacher.teacher_id" label="教职工号"></el-table-column>
        <el-table-column prop="teacher.teacher_name" label="教师姓名"></el-table-column>
        <el-table-column label="选课信息" width="180" align="center">
          <template #default="scope">
            <el-button
                type="text"
                icon="el-icon-edit"
                @click="handleClazz(scope.$index, scope.row)"
            >选课信息
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
<!--            <el-button-->
<!--                type="text"-->
<!--                icon="el-icon-edit"-->
<!--                @click="handleEdit(scope.$index, scope.row)"-->
<!--            >编辑-->
<!--            </el-button>-->
            <el-button
                type="text"
                icon="el-icon-delete"
                class="red"
                @click="handleDelete(scope.$index, scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="query.pageIndex"
            :page-size="query.pageSize"
            :total="pageTotal"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
      </template>
    </el-dialog>


    <el-dialog :title="selClazzTitle" v-model="clazzVisible" width="640px">
      <el-transfer
          v-model="selected_clazz"
          filterable
          :filter-method="clazzFilterMethod"
          filter-placeholder="搜索班级"
          :data="clazzData"
          :titles="['未选课班级', '已选课班级']"
      />
      <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleSaveClazzes()">确 定</el-button>
                </span>
      </template>
    </el-dialog>
    <!-- 导入弹出框 -->
    <el-dialog title="导入excel表格" v-model="importVisible" width="30%">
      <el-upload drag :action="uploadInstructExcelURL" name="excel" multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将开课信息文件拖到此处，或
          <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">只能上传 xls/xlsx 文件</div>
        </template>
      </el-upload>
      <el-upload drag :action="uploadInstructClazzesExcelURL" name="excel" multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将选课信息文件拖到此处，或
          <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">只能上传 xls/xlsx 文件</div>
        </template>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import {listInstructs, listInstructsClazzes, resetInstructsClazzes,
  uploadInstructExcelURL, uploadInstructClazzesExcelURL} from "../api/instruct";
import {listClazzes} from "../api/clazz";
import {deleteTeacher} from "../api/teacher";
import {getSelectedSemester, listSemesters} from "../api/semester";

export default {
  data() {
    return {
      query: {
        semesterID: "",
        search: "",
        pageIndex: 1,
        pageSize: 10
      },
      semesters: [],
      clazzData: [{key: "", label: "", disabled: false}],
      tableData: [],
      multipleSelection: [],
      delList: [],
      addVisible: false,
      editVisible: false,
      clazzVisible: false,
      importVisible: false,
      pageTotal: 0,
      form: {},
      idx: -1,
      id: -1,

      selected_clazz: [],
      selClazzTitle: "选课信息",
    };
  },
  computed: {
    uploadInstructExcelURL() {
      return uploadInstructExcelURL();
    },
    uploadInstructClazzesExcelURL() {
      return uploadInstructClazzesExcelURL();
    },
  },
  created() {
    this.getData();
    getSelectedSemester().then(resp=>{
      this.query.semesterID=resp.selected;
    });
  },
  watch: {
    "query.semesterID": function()  {
      this.loadInstruct();
    }
  },
  methods: {
    getData() {
      listClazzes().then(res => {
        this.clazzData = res.list.map(function (elem) {
          return {key: elem.clazz_id, label: elem.clazz_id + " - " + elem.clazz_name, disabled: false};
        });
        console.log(this.clazzData);
      });
      listSemesters().then(resp => {
        this.semesters = resp;
      });
      if(this.query.semesterID) {
        this.loadInstruct();
      }
    },
    // 触发搜索按钮
    handleSearch() {
      this.pageIndex = 1;
      this.getData();
    },
    // 删除操作
    handleDelete(index, row) {
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
          .then(() => {
            deleteTeacher(row.teacher_id).then(() => {
              this.$message.success("删除成功");
              this.tableData.splice(index, 1);
            });
          })
          .catch(() => {
          });
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    delAllSelection() {
      // 二次确认删除
      this.$confirm("确定要批量删除吗？", "提示", {
        type: "warning"
      }).then(() => {
        let proc = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          proc.push(deleteTeacher(this.multipleSelection[i].teacher_id));
        }
        Promise.all(proc).then(() => {
          this.$message.success(`删除成功`);
          this.multipleSelection = [];
          this.getData();
        }).catch(() => {
          this.$message.error(`删除出错`);
          this.multipleSelection = [];
          this.getData();
        });
      });
    },
    handleClazz(index, row) {
      this.idx = index;
      this.form = row;
      this.selClazzTitle = "选课信息 —— " + row.course.name + "(教师：" + row.teacher.teacher_name + "）";
      listInstructsClazzes(row.instruct_id).then(resp=>{
        this.selected_clazz=resp.map(function (elem) {
          return elem.clazz.clazz_id;
        });
      });
      this.clazzVisible = true;
    },
    handleAdd() {
      this.addVisible = true;
    },
    // 编辑操作
    handleEdit(index, row) {
      this.idx = index;
      this.form = row;
      this.editVisible = true;
    },
    // 保存编辑
    saveEdit() {
      this.editVisible = false;
      this.$message.success(`修改第 ${this.idx + 1} 行成功`);
      this.tableData[this.idx] = this.form;
    },
    // 分页导航
    handlePageChange(val) {
      this.query.pageIndex = val;
      this.getData();
    },
    clazzFilterMethod(query, item) {
      return item.key.includes(query) || item.label.includes(query);
    },
    loadInstruct() {
      listInstructs(this.query).then(res => {
        console.log(res);
        this.tableData = res.list;
        this.pageTotal = res.pageTotal;
      });
    },
    handleSaveClazzes() {
      const instruct = this.form;
      const instruct_id = instruct.instruct_id;
      resetInstructsClazzes(instruct_id, this.selected_clazz.map(clazz_id=>{
        return {
          id: 0,
          clazz: {
            clazz_id: clazz_id,
          },
          instruct: {
            instruct_id: instruct_id,
          }
        }
      })).then(this.getData).then(()=>{
        this.$message.success(`修改${instruct.course.name}（${instruct.teacher.teacher_name}）开课的选课班级列表成功`);
        this.clazzVisible = false;
      });
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

.table {
  width: 100%;
  font-size: 14px;
}

.red {
  color: #ff0000;
}

.mr10 {
  margin-right: 10px;
}

</style>
