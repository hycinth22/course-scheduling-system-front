<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 院系列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-lx-forward" @click="importVisible=true" class="mr10" v-if="canEdit">导入Excel</el-button>
        <el-input v-model="query.search" placeholder="编号/名称" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
      <el-table
          :data="tableData"
          border
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" v-if="canEdit"></el-table-column>
        <el-table-column prop="college.college_id" label="学院编号" width="105" align="center"></el-table-column>
        <el-table-column prop="college.college_name" label="学院名称" width="205"></el-table-column>
        <el-table-column prop="dept_id" label="系编号" width="75" align="center"></el-table-column>
        <el-table-column prop="dept_name" label="系名称" width="205"></el-table-column>
        <el-table-column label="操作" width="180" align="center" v-if="canEdit">
          <template #default="scope">
            <el-popconfirm title="确定删除吗？" @confirm="handleDelete(scope.$index, scope.row)">
              <template #reference>
                <el-button type="text" icon="el-icon-delete" class="red">删除</el-button>
              </template>
            </el-popconfirm>
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
      <!-- 导入弹出框 -->
      <el-dialog title="导入excel表格" v-model="importVisible" width="30%">
        <el-upload drag :action="uploadCollegeExcelURL" name="collegeExcel" multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将学院文件拖到此处，或
            <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">只能上传 xls/xlsx 文件</div>
          </template>
        </el-upload>
        <el-upload drag :action="uploadDepartmentExcelURL" name="departmentExcel" multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将系文件拖到此处，或
            <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">只能上传 xls/xlsx 文件</div>
          </template>
        </el-upload>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  listDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  uploadDepartmentExcelURL
} from "../api/dept";
import {
  uploadCollegeExcelURL,
} from "../api/college";
import {getUser} from "../login_state";

export default {
  data() {
    return {
      query: {
        search: "",
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [
        {
          "college": {
            "college_id": "string",
            "college_name": "string"
          },
          "dept_id": "string",
          "dept_name": "string"
        }
      ],
      multipleSelection: [],
      delList: [],
      pageTotal: 0,

      // 弹出框状态
      addVisible: false,
      editVisible: false,
      importVisible: false,
      form: {
        "college": {
          "college_id": "string",
          "college_name": "string"
        },
        "dept_id": "string",
        "dept_name": "string"
      },
      id_edit: null,
    };
  },
  created() {
    this.getData();
  },
  computed: {
    uploadCollegeExcelURL() {
      return uploadCollegeExcelURL()
    },
    uploadDepartmentExcelURL() {
      return uploadDepartmentExcelURL()
    },
    canEdit() {
      return getUser().role!=='teacher';
    },
  },
  methods: {
    getData() {
      listDepartments(this.query).then(res => {
        this.tableData = res.list;
        this.pageTotal = res.pageTotal;
      });
    },
    handleSearch() {
      this.query.pageIndex = 1;
      this.getData();
    },
    handleDelete(index, row) {
      deleteDepartment(row.dept_id).then(() => {
        this.$message.success("删除成功");
        this.tableData.splice(index, 1);
      });
    },
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
          proc.push(deleteDepartment(this.multipleSelection[i].dept_id));
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
    handleAdd() {
      this.form = {};
      this.addVisible = true;
    },
    saveAdd() {
      this.addVisible = false;
      addDepartment(this.form).then((resp) => {
        this.$message.success(`新增课程 ${resp.dept_id} 成功`);
        this.tableData.push(this.form);
      });
    },
    handleEdit(index, row) {
      this.id_edit = index;
      this.form = row;
      this.editVisible = true;
    },
    saveEdit() {
      this.editVisible = false;
      this.$message.success(`修改第 ${this.id_edit + 1} 行成功`);
      this.tableData.idx = this.form;
      updateDepartment(this.form).then(() => {
        this.getData();
      })
    },
    // 分页导航
    handlePageChange(val) {
      this.query.pageIndex = val;
      this.getData();
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
