<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 课程列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd" class="mr10">新增</el-button>
        <el-input v-model="query.search" placeholder="课程编号/课程名/开设单位" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>
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
        <el-table-column prop="id" label="课程编号" width="105" align="center"></el-table-column>
        <el-table-column prop="name" label="课程名"></el-table-column>
        <el-table-column prop="lessons" label="总课时"></el-table-column>
        <el-table-column prop="lessons_per_week" label="每周课时"></el-table-column>
        <el-table-column prop="kind" label="课程属性"></el-table-column>
        <el-table-column prop="exam_mode" label="考核方式"></el-table-column>
        <el-table-column prop="founder" label="开课单位"></el-table-column>


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


    <!-- 新增弹出框 -->
    <el-dialog title="新增" v-model="addVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="课程编号">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="课程名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="总学时">
          <el-input v-model.number="form.lessons"></el-input>
        </el-form-item>
        <el-form-item label="每周学时">
          <el-input v-model.number="form.lessons_per_week"></el-input>
        </el-form-item>
        <el-form-item label="考核方式">
          <el-input v-model="form.exam_mode"></el-input>
        </el-form-item>
        <el-form-item label="开课单位">
          <el-input v-model="form.founder"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveAdd">确 定</el-button>
                </span>
      </template>
    </el-dialog>
    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="课程编号">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="课程名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="总学时">
          <el-input v-model.number="form.lessons"></el-input>
        </el-form-item>
        <el-form-item label="每周学时">
          <el-input v-model.number="form.lessons_per_week"></el-input>
        </el-form-item>
        <el-form-item label="考核方式">
          <el-input v-model="form.exam_mode"></el-input>
        </el-form-item>
        <el-form-item label="开课单位">
          <el-input v-model="form.founder"></el-input>
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
          name="courseExcel"
          :on-success="getData"
          multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
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
import {listCourses, addCourse, deleteCourse, updateCourse, uploadCourseExcelURL} from "@/api/course";
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
          "exam_mode": "string",
          "founder": "string",
          "id": "string",
          "kind": "string",
          "lessons": 0,
          "lessons_per_week": 0,
          "name": "string"
        }
      ],
      multipleSelection: [],
      delList: [],
      pageTotal: 0,

      // 弹出框状态
      addVisible: false,
      editVisible: false,
      importVisible: false,
      form:   {
        "exam_mode": "string",
        "founder": "string",
        "id": "string",
        "kind": "string",
        "lessons": 0,
        "lessons_per_week": 0,
        "name": "string"
      },
      id_edit: -1,
    };
  },
  created() {
    this.getData();
  },
  computed: {
    uploadExcelURL() {
      return uploadCourseExcelURL()
    }
  },
  methods: {
    getData() {
      listCourses(this.query).then(res => {
        console.log(res);
        this.tableData = res.list;
        this.pageTotal = res.pageTotal;
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
      }).then(() => {
        deleteCourse(row.id).then(() => {
              this.$message.success("删除成功");
              this.tableData.splice(index, 1);
            }
        )
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
          proc.push(deleteCourse(this.multipleSelection[i].id));
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
      this.form = {};
      this.addVisible = true;
    },
    saveAdd() {
      this.addVisible = false;
      addCourse(this.form).then((resp) => {
        this.$message.success(`新增课程 ${resp.id} 成功`);
        this.tableData.push(this.form);
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
      updateCourse(this.form).then(()=>{
        this.getData();
        this.$message.success(`修改第 ${this.id_edit + 1} 行成功`);
        this.tableData.idx = this.form;
      })
    },
    // 分页导航
    handlePageChange(val) {
      this.query.pageIndex=val;
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
