<template>
  <div id="dashboard">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20 user-info-card" style="height:252px;">
          <div class="user-info">
            <img src="../assets/img/img.jpg" class="user-avatar" alt/>
            <div class="user-info-cont">
              <div class="user-info-name">{{ user.username }}</div>
              <div>{{ role_str }}</div>
            </div>
          </div>
          <div class="user-info-list">
            上次登录时间：
            <span>{{ (new Date(user.lastTime)).toLocaleString() }}</span>
          </div>
          <div class="user-info-list">
            上次登录地点：
            <span>{{ user.lastLoc ? user.lastLoc : "中国" }}</span>
          </div>
        </el-card>
        <el-card shadow="hover" style="height:252px;">
          <template #header>
            <div class="clearfix">
              <span>当前学期</span>
            </div>

          </template>
          第{{ semesterInfo.progress.cur }}周/共{{ semesterInfo.progress.total }}周
          <el-progress :percentage="(semesterInfo.progress.cur/semesterInfo.progress.total*100).toFixed(2)"
                       color="#42b983"></el-progress>
          教室利用率
          <el-progress :percentage="semesterInfo.clazzroom_usage.toFixed(2)" color="#f1e05a"></el-progress>
          教师平均每周课程数 {{ semesterInfo.teachersStats.avgLessons }}
          <el-progress :percentage="semesterInfo.teachersStats.percentage.toFixed(2)"></el-progress>
          班级平均每周课程数 {{ semesterInfo.studentStats.avgLessons }}
          <el-progress :percentage="semesterInfo.studentStats.percentage.toFixed(2)" color="#f56c6c"></el-progress>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <i class="el-icon-user-solid grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ counts.teachers }}</div>
                  <div>教师数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <i class="el-icon-message-solid grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ counts.lessons }}</div>
                  <div>开课数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-3">
                <i class="el-icon-s-flag grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ counts.clazzes }}</div>
                  <div>班级数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-card shadow="hover" style="height:403px;">
          <template #header>
            <div class="clearfix">
              <span>待办事项</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="handleAddTodo">添加</el-button>
            </div>
          </template>

          <el-table :show-header="false" :data="todoList" style="width:100%;" @row-dblclick="handleDelTodo">
            <el-table-column width="40">
              <template #default="scope">
                <el-checkbox v-model="scope.row.status"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="scope">
                <div
                    class="todo-item"
                    :class="{
                                        'todo-item-del': scope.row.status,
                                    }"
                >{{ scope.row.title }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="60">
              <template>
                <i class="el-icon-edit"></i>
                <i class="el-icon-delete"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <img class="bg" src="../assets/img/w.png" alt="decoration"/>
    </el-row>
  </div>
</template>

<script>
import {getTodos, setTodos} from "../todolist";

export default {
  name: "dashboard",
  data() {
    return {
      counts: {
        lessons: 78,
        teachers: 30,
        clazzes: 10,
      },
      user: {
        name: localStorage.getItem("ms_username"),
        role: "系统管理员",
        lastTime: "2077-11-01",
        lastLoc: "某地",
      },
      semesterInfo: {
        progress: {
          cur: 15, total: 18,
        },
        clazzroom_usage: 44.1,
        teachersStats: {
          percentage: 13.7,
          avgLessons: 11,
        },
        studentStats: {
          percentage: 13.7,
          avgLessons: 11,
        },
      },
      todoList: [],
      default_todoList: [
        {
          id: this.guid(),
          title: "录入课程信息、录入教室信息",
          status: true
        },
        {
          id: this.guid(),
          title: "录入师生信息、录入开课选课信息",
          status: true
        },
        {
          id: this.guid(),
          title: "录入开课选课信息",
          status: true
        },
        {
          id: this.guid(),
          title: "制定备选方案",
          status: false
        },
        {
          id: this.guid(),
          title: "选择方案与公布",
          status: false
        }
      ],

    };
  },
  created() {
    this.user = JSON.parse(localStorage.getItem("ms_userprofile"));
    this.todoList = getTodos();
    if (this.todoList.length === 0) {
      this.todoList = this.default_todoList;
    }
  },
  watch: {
    todoList: {
      handler(newValue) {
        setTodos(newValue);
      },
      deep: true,
    }
  },
  computed: {
    role_str() {
      const table = {
        "admin": "系统管理员",
        "operator": "教务管理",
        "teacher": "教师",
      };
      return table[this.user.role] ? table[this.user.role] : "普通用户";
    }
  },
  methods: {
    guid() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }

      return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },
    handleAddTodo() {
      let content = prompt("输入要添加的待办事项");
      if (content === "undefined") return;
      const obj = {
        id: this.guid(),
        title: content,
        status: false
      };
      this.todoList.push(obj);
    },
    handleDelTodo(row) {
      const idx = this.todoList.findIndex((elem)=>elem.id===row.id);
      console.log(idx);
      if(idx!==-1){
        this.todoList.splice(idx, 1);
      }
    }
  }
};
</script>

<style scoped>

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.bg {
  width: 100%;
  height: auto;
}

</style>
