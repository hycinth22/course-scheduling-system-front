<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 学期列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd" class="mr10">新增</el-button>
        <el-checkbox v-model="hidePast" @change="handleToggleHidePast">隐藏已结束的学期</el-checkbox>
      </div>
      <el-table
          :data="filtered_data"
          border
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <!--        <el-table-column type="index" label="序号" width="75" align="center"></el-table-column>-->
        <el-table-column prop="semester_name" label="名称"></el-table-column>
        <el-table-column prop="start_date" label="起始日期"></el-table-column>
        <el-table-column prop="semester_weeks" label="周数"></el-table-column>
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
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="学期名称">
          <el-input v-model="form.semester_name" placeholder="请输入学期名称"></el-input>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-input v-model="form.start_date" placeholder="请输入开始日期（不可重复）" disabled></el-input>
        </el-form-item>
        <el-form-item label="周数">
          <el-input v-model.number="form.semester_weeks" placeholder="请输入学期周数"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
      </template>
    </el-dialog>
    <el-dialog title="新增" v-model="addVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="学期名称">
          <el-input v-model="form.semester_name"  placeholder="请输入学期名称"></el-input>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-input v-model="form.start_date" placeholder="请输入开始日期（不可重复）"></el-input>
        </el-form-item>
        <el-form-item label="周数">
          <el-input v-model.number="form.semester_weeks" placeholder="请输入学期周数"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveAdd">确 定</el-button>
                </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {getHiddenPastSemester, listSemesters, saveHiddenPastSemester, addSemester, updateSemester, deleteSemester} from "../api/semester";

export default {
  data() {
    return {
      query: {
        address: "",
        name: "",
        pageIndex: 1,
        pageSize: 10,
      },
      data: [
        {
          "semester_name": "string",
          "semester_weeks": 0,
          "start_date": "string"
        }
      ],
      multipleSelection: [],
      delList: [],
      addVisible: false,
      editVisible: false,
      pageTotal: 0,
      form:         {
        "semester_name": "",
        "semester_weeks": 0,
        "start_date": ""
      },
      idx: -1,
      id: -1,
      hidePast: false
    };
  },
  created() {
    this.getData();
    getHiddenPastSemester().then((resp)=>{
      this.hidePast = resp.val;
    });
  },
  computed: {
    filtered_data() {
      if (!this.hidePast) return this.data;
      const now = Date.now();
      return this.data.filter(function (currentValue) {
        let date = new Date(currentValue.start_date);
        date.setTime(date.getTime() + currentValue.semester_weeks * 7 * 86400 * 1000);
        return date > now;
      })
    },
  },
  methods: {
    handleToggleHidePast(newVal) {
      saveHiddenPastSemester(newVal);
      this.getData();
    },
    getData() {
      return listSemesters(true).then(resp => {
        console.log(resp);
        this.data = resp;
      });
    },
    handleSearch() {
      this.query.pageIndex = 1;
      this.getData();
    },
    // 删除操作
    handleDelete(index, row) {
      deleteSemester(row.start_date).then(() => {
        this.$message.success("删除成功");
        this.data.splice(index, 1);
      }).then(this.getData);
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    delAllSelection() {
      const length = this.multipleSelection.length;
      let str = "";
      this.delList = this.delList.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + " ";
      }
      this.$message.error(`删除了${str}`);
      this.multipleSelection = [];
    },
    handleAdd() {
      this.form={};
      this.addVisible = true;
    },
    // 编辑操作
    handleEdit(index, row) {
      this.idx = index;
      this.form = row;
      this.editVisible = true;
    },
    saveAdd() {
      addSemester(this.form).then(this.getData).then(()=>{
        this.addVisible = false;
        this.$message.success(`新增成功`);
      })
    },
    saveEdit() {
      updateSemester(this.form).then(this.getData).then(()=>{
        this.editVisible = false;
        this.$message.success(`新增成功`);
      })
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
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
