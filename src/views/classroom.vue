<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 教室列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd" class="mr10">新增</el-button>
        <el-input v-model="query.search" placeholder="教学楼/教室号" class="handle-input mr10"></el-input>
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
        <el-table-column prop="id" label="序号" width="55" align="center"></el-table-column>
        <el-table-column prop="building" label="教学楼" width="405" align="center"></el-table-column>
        <el-table-column prop="room" label="教室号" width="405" align="center"></el-table-column>
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
        <el-form-item label="教学楼">
          <el-input v-model="form.building"></el-input>
        </el-form-item>
        <el-form-item label="教室号">
          <el-input v-model="form.room"></el-input>
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
        <el-form-item label="No">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="教学楼">
          <el-input v-model="form.building"></el-input>
        </el-form-item>
        <el-form-item label="教室号">
          <el-input v-model="form.room"></el-input>
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
import {
  listClassrooms,
  addClassroom,
  deleteClassroom,
  updateClassroom,
  uploadClassroomExcelURL
} from "../api/clazzroom";

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
          "building": "string",
          "room": "string"
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
        "building": "string",
        "room": "string"
      },
      id_edit: null,
    };
  },
  created() {
    this.getData();
  },
  computed: {
    uploadExcelURL() {
      return uploadClassroomExcelURL()
    }
  },
  methods: {
    getData() {
      listClassrooms(this.query).then(res => {
        this.tableData = res.list;
        this.pageTotal = res.pageTotal;
      });
    },
    handleSearch() {
      this.query.pageIndex = 1;
      this.getData();
    },
    handleDelete(index, row) {
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      }).then(() => {
        deleteClassroom(row.id).then(() => {
              this.$message.success("删除成功");
              this.tableData.splice(index, 1);
            }
        )
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
          proc.push(deleteClassroom(this.multipleSelection[i].id));
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
      addClassroom(this.form).then((resp) => {
        this.$message.success(`新增课程 ${resp.id} 成功`);
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
      updateClassroom(this.form).then(() => {
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
