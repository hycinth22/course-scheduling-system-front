<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 用户列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button
            type="primary"
            icon="el-icon-delete"
            class="handle-del mr10"
            @click="delAllSelection"
        >批量删除
        </el-button>
        <el-input v-model="query.search" placeholder="搜索用户名/职工号" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="text" con="el-icon-add" @click="handleAdd">新增</el-button>
      </div>
      <el-table
          :data="userList"
          border
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="用户名"></el-table-column>
        <el-table-column prop="role" label="身份">
          <template #default="scope">
            {{ roleTable(scope.row.role) }} {{ associatedInfo(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="帐号状态" width="80" align="center">
          <template #default="scope">
            <el-tag
                :type="
                                scope.row.status === 0
                                    ? 'success'
                                    : scope.row.status === 1
                                    ? 'danger'
                                    : ''
                            "
            >{{ scope.row.status === 1 ? "禁用" : "正常" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="last_login_time" label="上次登录时间">
          <template #default="scope">
            {{ new Date(scope.row.last_login_time).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="last_login_loc" label="上次登录地点"></el-table-column>
        <el-table-column prop="created_at" label="创建时间">
          <template #default="scope">
            {{ new Date(scope.row.created_at).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="updated_at" label="修改时间">
          <template #default="scope">
            {{ new Date(scope.row.updated_at).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="350" align="center">
          <template #default="scope">
            <el-button
                type="text"
                icon="el-icon-lx-warnfill"
                @click="handleToggleStatus(scope.$index, scope.row)"
            >启用/禁用
            </el-button>
            <el-button
                type="text"
                icon="el-icon-help"
                class="danger"
                @click="handleResetPWD(scope.$index, scope.row)"
            >重置密码
            </el-button>
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
        <el-form-item label="帐号ID">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.name"  placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="用户身份">
          <el-select v-model="form.role" placeholder="请选择用户身份" size="medium">
            <el-option
                v-for="(val,key) in roles"
                :key="key" :label="val" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="帐号状态">
          <el-select v-model.number="form.status" placeholder="请选择帐号状态" size="medium">
            <el-option key="0" label="正常" :value="0"></el-option>
            <el-option key="1" label="禁用" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联教师">
          <el-input v-model="form.associated_teacher.teacher_id" placeholder="请输入关联教师的工号"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
      </template>
    </el-dialog>
    <el-dialog title="新增帐号" v-model="addVisible" width="30%">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form.name" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="帐号密码" >
          <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="帐号身份">
          <el-select v-model="form.role" placeholder="请选择用户身份" size="medium">
            <el-option
                v-for="(val,key) in roles"
                :key="key" :label="val" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="帐号状态">
          <el-select v-model.number="form.status" placeholder="请选择帐号状态" size="medium">
            <el-option key="0" label="正常" :value="0"></el-option>
            <el-option key="1" label="禁用" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联教师">
          <el-input v-model="form.associated_teacher.teacher_id" placeholder="请输入关联教师的工号"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {listUsers, resetUserPassword, setUserStatus, deleteUser} from "../api/user";
import {getRoleStr} from "../roles";
import roles from "../roles";

export default {
  data() {
    return {
      query: {
        search: "",
        pageIndex: 1,
        pageSize: 10
      },
      userList: [],
      multipleSelection: [],
      delList: [],
      addVisible: false,
      editVisible: false,
      pageTotal: 0,
      form:  {
        "id": null,
        "name": null,
        "role": null,
        "status": null,
        "last_login_time": null,
        "last_login_loc": null,
        "associated_teacher": {
          "teacher_id": null,
          "teacher_name": null,
          "teacher_title": null,
          "teacher_tel": null,
          "dept": null
        },
        "created_at": null,
        "updated_at": null
      },
      idx: -1,
      id: -1
    };
  },
  computed: {
    roles() {
      return roles;
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      listUsers(this.query).then(res => {
        console.log(res);
        this.userList = res.list;
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
      console.log(index, row);
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      }).then(() => {
        deleteUser(row.id).then(() => {
              this.$message.success("删除成功");
              this.getData();
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
          proc.push(deleteUser(this.multipleSelection[i].id));
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
      this.form = {
        "id": 0,
        "name": "",
        "role": "",
        "status": 0,
        "last_login_time": null,
        "last_login_loc": null,
        "associated_teacher": {
          "teacher_id": null,
          "teacher_name": null,
          "teacher_title": null,
          "teacher_tel": null,
          "dept": null
        },
        "created_at": null,
        "updated_at": null
      };
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
    roleTable(role) {
      return getRoleStr(role);
    },
    handleToggleStatus(index, row) {
      setUserStatus(row.id, row.status === 0 ? 1 : 0).then(() => {
        this.getData();
        this.$message.success(`启用/禁用成功`);
      });
    },
    handleResetPWD(index, row) {
      const newPwd = prompt("输入新密码");
      resetUserPassword(row.id, newPwd).then(() => {
        this.getData();
        this.$message.success(`重置密码成功`);
      });
    },
    associatedInfo(row) {
      if (!row.associated_teacher) return "";
      if (row.associated_teacher.teacher_id.length === 0) return "";
      return "(" + row.associated_teacher.teacher_id.toString() + ")";
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

.danger {
  color: #F56C6C;
}

.mr10 {
  margin-right: 10px;
}


</style>
