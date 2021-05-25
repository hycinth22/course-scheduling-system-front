<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 教师列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd" class="mr10">新增</el-button>
        <!--        <el-select v-model="query.at" placeholder="院系" class="handle-select mr10" size="medium">-->
        <!--          <el-option key="1" label="电子信息工程-电信工程系" value="电子信息工程-电信工程系"></el-option>-->
        <!--          <el-option key="2" label="电子信息工程-通信工程系" value="电子信息工程-通信工程系"></el-option>-->
        <!--          <el-option key="2" label="电子信息工程-物联网系" value="电子信息工程-物联网系"></el-option>-->
        <!--        </el-select>-->
        <el-input v-model="query.search" placeholder="教职工号/姓名/职称/电话" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button
            type="danger"
            icon="el-icon-delete"
            class="handle-del mr10"
            @click="delAllSelection"
        >删除选中条目
        </el-button>
        <el-button type="primary" icon="el-icon-lx-forward" @click="importVisible=true" class="mr10">导入Excel</el-button>
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
        <el-table-column prop="teacher_id" label="教职工号" width="95" align="center"></el-table-column>
        <el-table-column prop="teacher_name" label="姓名"></el-table-column>
        <el-table-column prop="teacher_title" label="职称"></el-table-column>
        <el-table-column label="所属院系">
          <template #default="scope"> {{ scope.row.dept.dept_name }}</template>
        </el-table-column>
        <el-table-column prop="teacher_tel" label="联系方式"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)"
            >编辑
            </el-button>
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

    <!-- 弹出框 -->
    <el-dialog title="新增" v-model="addVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="教职工号">
          <el-input v-model="form.teacher_id"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.teacher_name"></el-input>
        </el-form-item>
        <el-form-item label="职称">
          <el-input v-model="form.teacher_title"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.teacher_tel"></el-input>
        </el-form-item>
        <el-form-item label="院系编号">
          <el-input v-model="form.dept.dept_id"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveAdd">确 定</el-button>
                </span>
      </template>
    </el-dialog>
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="教职工号">
          <el-input v-model="form.teacher_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.teacher_name"></el-input>
        </el-form-item>
        <el-form-item label="职称">
          <el-input v-model="form.teacher_title"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.teacher_tel"></el-input>
        </el-form-item>
        <el-form-item label="院系编号">
          <el-input v-model="form.dept.dept_id"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
      </template>
    </el-dialog>
    <!-- 导入弹出框 -->
    <el-dialog title="导入excel表格" v-model="importVisible" width="30%">
      <el-upload
          drag
          :action="uploadExcelURL"
          name="excel"
          multiple
          @on-success="getData"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将教师Excel文件拖到此处，或
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
import {listTeachers, addTeacher, updateTeacher, deleteTeacher, uploadTeacherExcelURL} from "../api/teacher";

export default {
  data() {
    return {
      query: {
        address: "",
        name: "",
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      multipleSelection: [],
      delList: [],
      addVisible: false,
      editVisible: false,
      importVisible: false,
      pageTotal: 0,
      form: {
        "teacher_id": "10006",
        "teacher_name": "赵六",
        "teacher_title": "副研究员",
        "teacher_tel": "13000000005",
        "dept": {
          "dept_id": "0201",
          "dept_name": "院系01",
          "college": {
            "college_id": "02",
            "college_name": "电子信息工程学院"
          }
        }
      },
      id_edit: -1,
      id: -1
    };
  },
  computed: {
    uploadExcelURL() {
      return uploadTeacherExcelURL();
    }
  },
  created() {
    this.getData();
  },
  methods: {
    // 获取 easy-mock 的模拟数据
    getData() {
      listTeachers(this.query).then(res => {
        console.log(res);
        this.tableData = res.list;
        this.pageTotal = res.pageTotal || 50;
      });
    },
    // 触发搜索按钮
    handleSearch() {
      this.query.pageIndex = 1;
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
        Promise.all(proc).then(()=>{
          this.$message.success(`删除成功`);
          this.multipleSelection = [];
          this.getData();
        }).catch(()=>{
          this.$message.error(`删除出错`);
          this.multipleSelection = [];
          this.getData();
        });
      });
    },
    handleAdd() {
      this.resetForm();
      this.addVisible = true;
    },
    saveAdd() {
      this.addVisible = false;
      addTeacher(this.form).then(() => {
        this.$message.success(`新增教师成功`);
        this.tableData.push(this.form);
        this.getData();
      });
    },
    // 编辑操作
    handleEdit(index, row) {
      this.id_edit = index;
      this.form = row;
      this.editVisible = true;
    },
    // 保存编辑
    saveEdit() {
      this.editVisible = false;
      updateTeacher(this.form).then(()=>{
        this.getData();
        this.$message.success(`修改第 ${this.id_edit + 1} 行成功`);
        this.id_edit = this.form;
      })
    },
    // 分页导航
    handlePageChange(val) {
      this.query.pageIndex = val;
      this.getData();
    },
    resetForm() {
      this.form={
        "teacher_id": "",
        "teacher_name": "",
        "teacher_title": "",
        "teacher_tel": "",
        "dept": {
          "dept_id": "",
          "dept_name": "",
          "college": {
            "college_id": "",
            "college_name": ""
          }
        }
      };
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
