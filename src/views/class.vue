<template>
  <div v-loading="loading">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 班级列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <!--        <el-select v-model="query.at" placeholder="学院" class="handle-select mr10">-->
        <!--          <el-option key="1" label="电子信息工程学院" value="电子信息工程学院"></el-option>-->
        <!--          <el-option key="2" label="电子信息工程学院" value="电子信息工程学院"></el-option>-->
        <!--        </el-select>-->
        <el-input v-model="query.name" placeholder="编号/班级名" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-lx-forward" @click="importVisible=true" class="mr10">导入Excel</el-button>
        <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">删除选中条目
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
        <el-table-column prop="clazz_id" label="编号" width="85" align="center"></el-table-column>
        <el-table-column prop="college.college_name" label="所属学院"></el-table-column>
        <el-table-column prop="clazz_name" label="名称"></el-table-column>

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

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="编号">
          <el-input v-model="form.clazz_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.clazz_name"></el-input>
        </el-form-item>
        <el-form-item label="所属学院">
          <el-input v-model="form.college.college_id"></el-input>
        </el-form-item>
        <el-form-item label="所属学院">
          <el-input v-model="form.college.college_name" disabled></el-input>
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
          将班级Excel文件拖到此处，或
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
import {deleteClazz, listClazzes, updateClazz, uploadClazzExcelURL} from "../api/clazz";

export default {
  data() {
    return {
      query: {
        search: "",
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
      form: {},
      idx: -1,
      id: -1,
      loading: false,
    };
  },
  created() {
    this.loading = true;
    this.getData();
    this.loading = false;
  },
  computed: {
    uploadExcelURL() {
      return uploadClazzExcelURL();
    }
  },
  methods: {
    getData() {
      return listClazzes(this.query).then(res => {
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
      deleteClazz(row.clazz_id).then(() => {
        this.loading = false;
        this.$message.success("删除成功");
      }).then(this.getData);
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    delAllSelection() {
      this.$confirm("确定要批量删除吗？", "提示", {
        type: "warning"
      }).then(() => {
        let proc = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          proc.push(deleteClazz(this.multipleSelection[i].teacher_id));
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
      updateClazz(this.form).then(this.getData).then(() => {
        this.editVisible = false;
        this.$message.success(`修改 ${this.form.clazz_id + 1} 成功`);
      })
    },
    // 分页导航
    handlePageChange(val) {
      this.query.pageIndex = val;
      this.getData();
    },
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
