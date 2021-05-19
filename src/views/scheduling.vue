<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 自动排表
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
        <el-select v-model="query.scheduleID" placeholder="选择方案" class="handle-select mr10">
          <el-option
              v-for="item in schedules"
              :key="item.schedule_id"
              :label="'方案'+item.schedule_id"
              :value="item.schedule_id">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-lx-add" @click="handleAddSchedule" class="mr10">新增方案</el-button>
        <el-button type="danger" icon="el-icon-lx-delete" @click="handleDeleteAllSchedule" class="mr10">清空所有方案
        </el-button>
      </div>
      <el-divider></el-divider>
      <div class="">
        <p>方案查看区</p>
        <br>
        <p>方案 {{query.scheduleID}} 的分数为：{{ planScore.toFixed(3) }}（越低表示越好）</p>
        <el-tabs tab-position="left">
          <el-tab-pane label="学生课表" name="first">
            <div class="handle-box">
              <el-select v-model="query.collegeID" placeholder="选择学院" class="handle-select mr10">
                <el-option
                    v-for="item in colleges"
                    :key="item.college_id"
                    :label="item.college_name"
                    :value="item.college_id">
                </el-option>
              </el-select>
              <el-select v-model="query.clazzID" placeholder="选择班级" class="handle-select mr10">
                <el-option
                    v-for="item in clazzes"
                    :key="item.clazz_id"
                    :label="item.clazz_name"
                    :value="item.clazz_id">
                </el-option>
              </el-select>
            </div>
            <el-table :data="studentTableData" border class="table" ref="multipleTable"
                      id="studentTable"
                      header-cell-class-name="table-header">
              <el-table-column type="index" label="时间段" width="95" align="center"></el-table-column>
              <el-table-column prop="1" label="周一" min-width="180" align="center"
                               :formatter="formatterItemForStudent">
              </el-table-column>
              <el-table-column prop="2" label="周二" min-width="180" align="center"
                               :formatter="formatterItemForStudent"></el-table-column>
              <el-table-column prop="3" label="周三" min-width="180" align="center"
                               :formatter="formatterItemForStudent"></el-table-column>
              <el-table-column prop="4" label="周四" min-width="180" align="center"
                               :formatter="formatterItemForStudent"></el-table-column>
              <el-table-column prop="5" label="周五" min-width="180" align="center"
                               :formatter="formatterItemForStudent"></el-table-column>
              <el-table-column prop="6" label="周六" min-width="95" align="center"
                               :formatter="formatterItemForStudent"></el-table-column>
              <el-table-column prop="7" label="周日" min-width="95" align="center"
                               :formatter="formatterItemForStudent"></el-table-column>
            </el-table>
            <el-divider></el-divider>
            <el-link target="_blank" :href="downloadStudentExcel" :underline="true" icon="el-icon-lx-down" class="mr10">
              导出学生课表Excel
            </el-link>
            <el-link href="#" @click="printStudent" :underline="true" icon="el-icon-lx-file" class="mr10">
              打印学生课表
            </el-link>
          </el-tab-pane>
          <el-tab-pane label="院系课表" name="second">
            <div class="handle-box">
              <el-select v-model="query.collegeID" placeholder="选择学院" class="handle-select mr10">
                <el-option
                    v-for="item in colleges"
                    :key="item.college_id"
                    :label="item.college_name"
                    :value="item.college_id">
                </el-option>
              </el-select>
              <el-select v-model="query.deptID" placeholder="选择院系" class="handle-select mr10">
                <el-option
                    v-for="item in departments"
                    :key="item.dept_id"
                    :label="item.dept_name"
                    :value="item.dept_id">
                </el-option>
              </el-select>
            </div>
            <el-table
                :data="teacherTableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                id="teacherTable"
            >
              <el-table-column type="index" label="时间段" width="95" align="center"></el-table-column>
              <el-table-column prop="1" label="周一" min-width="180" align="center"
                               :formatter="formatterItemForTeacher"></el-table-column>
              <el-table-column prop="2" label="周二" min-width="180" align="center"
                               :formatter="formatterItemForTeacher"></el-table-column>
              <el-table-column prop="3" label="周三" min-width="180" align="center"
                               :formatter="formatterItemForTeacher"></el-table-column>
              <el-table-column prop="4" label="周四" min-width="180" align="center"
                               :formatter="formatterItemForTeacher"></el-table-column>
              <el-table-column prop="5" label="周五" min-width="180" align="center"
                               :formatter="formatterItemForTeacher"></el-table-column>
              <el-table-column prop="6" label="周六" min-width="95" align="center"
                               :formatter="formatterItemForTeacher"></el-table-column>
              <el-table-column prop="7" label="周日" min-width="95" align="center"
                               :formatter="formatterItemForTeacher"></el-table-column>
            </el-table>
            <el-divider></el-divider>
            <el-link target="_blank" :href="downloadTeacherExcel" :underline="true" icon="el-icon-lx-down" class="mr10">
              导出院系课表Excel
            </el-link>
            <el-link href="#" @click="printTeacher" :underline="true" icon="el-icon-lx-file" class="mr10">
              打印院系课表
            </el-link>

          </el-tab-pane>
          <el-tab-pane label="教师课表" name="third">
            <div class="handle-box">
              <el-select v-model="query.collegeID" placeholder="选择学院" class="handle-select mr10">
                <el-option
                    v-for="item in colleges"
                    :key="item.college_id"
                    :label="item.college_name"
                    :value="item.college_id">
                </el-option>
              </el-select>
              <el-select v-model="query.teacherID" placeholder="选择教师" class="handle-select mr10">
                <el-option
                    v-for="item in teachers"
                    :key="item.teacher_id"
                    :label="item.teacher_id + ' ' +item.teacher_name + '(' + item.teacher_title + ')' "
                    :value="item.teacher_id">
                </el-option>
              </el-select>
            </div>
            <el-table
                :data="teacherPersonalTableData" border class="table" ref="multipleTable"
                header-cell-class-name="table-header"
                id="teacherPersonalTable"
            >
              <el-table-column type="index" label="时间段" width="95" align="center"></el-table-column>
              <el-table-column prop="1" label="周一" min-width="180" align="center"
                               :formatter="formatterItemForTeacherPersonal"></el-table-column>
              <el-table-column prop="2" label="周二" min-width="180" align="center"
                               :formatter="formatterItemForTeacherPersonal"></el-table-column>
              <el-table-column prop="3" label="周三" min-width="180" align="center"
                               :formatter="formatterItemForTeacherPersonal"></el-table-column>
              <el-table-column prop="4" label="周四" min-width="180" align="center"
                               :formatter="formatterItemForTeacherPersonal"></el-table-column>
              <el-table-column prop="5" label="周五" min-width="180" align="center"
                               :formatter="formatterItemForTeacherPersonal"></el-table-column>
              <el-table-column prop="6" label="周六" min-width="95" align="center"
                               :formatter="formatterItemForTeacherPersonal"></el-table-column>
              <el-table-column prop="7" label="周日" min-width="95" align="center"
                               :formatter="formatterItemForTeacherPersonal"></el-table-column>
            </el-table>
            <el-divider></el-divider>
            <el-link target="_blank" :href="downloadTeacherPersonalExcel" :underline="true" icon="el-icon-lx-down"
                     class="mr10">
              导出教师个人课表Excel
            </el-link>
            <el-link href="#" @click="printTeacherPersonal" :underline="true" icon="el-icon-lx-file" class="mr10">
              打印教师个人课表
            </el-link>

          </el-tab-pane>
        </el-tabs>
      </div>
      <el-divider></el-divider>
      <div>
        当前方案操作：
        <el-button type="danger" icon="el-icon-lx-delete" @click="handleDeleteSchedule(query.scheduleID)" class="mr10">
          删除方案
        </el-button>
        <el-checkbox v-model="form.enabled">选中</el-checkbox>
        <el-button type="primary" icon="el-icon-lx-text" @click="savePlan" class="mr10">保存</el-button>
      </div>
    </div>

    <!-- 编辑弹出框 -->
  </div>
</template>

<script>
import {listSemesters} from "../api/semester";
import {
  listSchedulesInSemester, listSchedulesItemsGroupView,
  createNewSchedule, deleteSchedule, deleteScheduleInSemester,
  downloadStudentExcelURL, downloadTeacherExcelURL, downloadTeacherPersonalExcelURL,
    saveSelectedSchedule
} from "../api/schduling";
import {listColleges} from "../api/college";
import {listClazzesInCollege} from "../api/clazz";
import {listDepartmentsInCollege} from "../api/dept";
import {listTeachersInCollege} from "../api/teacher";

export default {
  data() {
    return {
      query: {
        semesterID: null,
        scheduleID: null,
        collegeID: null,
        clazzID: null,
        deptID: null,
        teacherID: null,
      },
      planScore: 0.0,
      form: {
        enabled: false,
        publish: false,
      },
      semesters: [
        {
          "semester_name": "string",
          "semester_weeks": 0,
          "start_date": "string"
        }
      ],
      schedules: [
        {
          "schedule_id": 0,
          "semester": {
            "semester_name": "string",
            "semester_weeks": 0,
            "start_date": "string"
          }
        }
      ],
      colleges: [
        {
          "college_id": "string",
          "college_name": "string"
        }
      ],
      clazzes: [
        {
          "clazz_id": "string",
          "clazz_name": "string",
          "college": {
            "college_id": "string",
            "college_name": "string"
          }
        }
      ],
      teachers: [
        {
          "teacher_id": "string",
          "teacher_name": "string",
          "teacher_title": "string",
          "teacher_tel": "string",
          "college": {
            "college_id": "string",
            "college_name": "string"
          }
        }
      ],
      departments: [
        {
          "college": {
            "college_id": "string",
            "college_name": "string"
          },
          "dept_id": "string",
          "dept_name": "string"
        }
      ],
      useTimespans: 0,
      clazzData: [
        [
          {
            "1":
                {
                  "clazz": {
                    "clazz_id": "string",
                    "clazz_name": "string",
                    "college": {
                      "college_id": "string",
                      "college_name": "string"
                    }
                  },
                  "clazzroom": {
                    "building": "string",
                    "room": "string"
                  },
                  "day_of_week": 0,
                  "instruct": {
                    "course": {
                      "exam_mode": "string",
                      "founder": "string",
                      "id": "string",
                      "kind": "string",
                      "lessons": 0,
                      "lessons_per_week": 0,
                      "name": "string"
                    },
                    "semester": {
                      "semester_name": "string",
                      "semester_weeks": 0,
                      "start_date": "string"
                    },
                    "teacher": {
                      "dept": {
                        "college": {
                          "college_id": "string",
                          "college_name": "string"
                        },
                        "dept_id": "string",
                        "dept_name": "string"
                      },
                      "teacher_id": "string",
                      "teacher_name": "string",
                      "teacher_tel": "string",
                      "teacher_title": "string"
                    }
                  },
                  "schedule_id": 0,
                  "timespan_id": 0
                }
          }
        ],
      ], // [clazz_id][timespan][week]
      deptData: [
        [],
      ],  // [dept_id][timespan][week]
      teacherPersonalData: [
        // [teacher_id][timespan][week]
      ],
      k: 0,
    };
  },
  created() {
    this.loadSemesters();
    this.loadColleges();
  },
  watch: {
    "query.semesterID": function () {
      this.loadSchedulesList(this.query.semesterID);
    },
    "query.collegeID": function () {
      this.loadClazzes(this.query.collegeID);
      this.loadDepartments(this.query.collegeID);
      this.loadTeachers(this.query.collegeID);
    },
    "query.scheduleID": function () {
      this.loadSchedulesItems(this.query.scheduleID);
    },
  },
  methods: {
    handleAddSchedule() {
      createNewSchedule(this.query.semesterID).then(resp => {
        this.schedules.push({
          "schedule_id": resp.schedule_id,
          "semester": {
            "semester_name": resp.semester.semester_name,
            "semester_weeks": resp.semester.semester_weeks,
            "start_date": resp.semester.start_date
          }
        });
        this.query.scheduleID = resp.schedule_id;
        this.$message.success("新建方案成功，已选择新方案");
      });
    },
    handleDeleteSchedule(schedule_id) {
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      }).then(() => {
        deleteSchedule(schedule_id).then(() => {
              this.clazzData = [];
              this.deptData = [];
              this.$message.success("删除成功");
              this.loadSchedulesList(this.query.semesterID);
            }
        )
      });
    },
    handleDeleteAllSchedule() {
      // 二次确认删除
      this.$confirm("确定要清空吗？这将删除该学期的所有方案！", "提示", {
        type: "warning"
      }).then(() => {
        deleteScheduleInSemester(this.query.semesterID).then(() => {
              this.clazzData = [];
              this.deptData = [];
              this.$message.success("清空成功");
              this.loadSchedulesList(this.query.semesterID);
            }
        )
      });
    },
    loadSemesters() {
      listSemesters().then(resp => {
        this.semesters = resp;
      });
    },
    loadSchedulesList(semester) {
      this.query.scheduleID = null;
      this.schedules = [];
      listSchedulesInSemester(semester).then(resp => {
        this.schedules = resp;
      });
    },
    loadSchedulesItems(scheduleID) {
      listSchedulesItemsGroupView(scheduleID).then(resp => {
        this.planScore = resp.score;
        this.clazzData = resp.items.by_clazz;
        this.deptData = resp.items.by_dept;
        this.teacherPersonalData = resp.items.by_teacher_personal;
      })
    },
    loadColleges() {
      listColleges().then(resp => {
        this.colleges = resp;
      });
    },
    loadClazzes(collegeID) {
      this.query.clazzID = null;
      this.clazzes = [];
      listClazzesInCollege(collegeID).then(resp => {
        this.clazzes = resp;
      });
    },
    loadDepartments(collegeID) {
      this.query.deptID = null;
      this.departments = [];
      listDepartmentsInCollege(collegeID).then(resp => {
        this.departments = resp;
      });
    },
    loadTeachers(collegeID) {
      this.query.teacherID = null;
      this.teachers = [];
      listTeachersInCollege(collegeID).then(resp => {
        this.teachers = resp;
      });
    },
    savePlan() {
      saveSelectedSchedule(this.query.semesterID, this.query.scheduleID);
    },
    formatterItemForStudent(row, column, cellValue) {
      if (!cellValue) return "";
      return cellValue.instruct.course.name + "(" + cellValue.instruct.course.kind + ")" + "\n"
          + cellValue.instruct.teacher.teacher_name + cellValue.instruct.teacher.teacher_title + "\n"
          + cellValue.clazzroom.building + cellValue.clazzroom.room + "\n"
          + "第1-" + Math.ceil(cellValue.instruct.course.lessons / cellValue.instruct.course.lessons_per_week) + "周";
    },
    formatterItemForTeacher(row, column, cellValue) {
      if (!cellValue) return "";
      return cellValue.map(function (item) {
        console.log(item);
        return item.instruct.teacher.teacher_name + item.instruct.teacher.teacher_title + "\n"
            + item.instruct.course.name + " - " + item.clazz.clazz_name + "\n"
            + item.clazzroom.building + item.clazzroom.room + "\n"
            + "第1-" + Math.ceil(item.instruct.course.lessons / item.instruct.course.lessons_per_week) + "周";
      }).join("\n\n");
    },
    formatterItemForTeacherPersonal(row, column, cellValue) {
      if (!cellValue) return "";
      return cellValue.instruct.course.name + "(" + cellValue.instruct.course.kind + ")" + "\n"
          + cellValue.instruct.teacher.teacher_name + cellValue.instruct.teacher.teacher_title + "\n"
          + cellValue.clazzroom.building + cellValue.clazzroom.room + "\n"
          + "第1-" + Math.ceil(cellValue.instruct.course.lessons / cellValue.instruct.course.lessons_per_week) + "周";
    },
    printStudent() {
      this.printElem("studentTable");
    },
    printTeacher() {
      this.printElem("teacherTable");
    },
    printTeacherPersonal() {
      this.printElem("teacherPersonalTable");
    },
    printElem(myDiv) {
      const newWindow = window.open("打印窗口", "_blank");
      const docStr = document.getElementById(myDiv).innerHTML;
      newWindow.document.write(docStr);
      const styles = document.createElement("style");
      styles.setAttribute('type', 'text/css'); //media="print"
      styles.innerHTML = `table {
  width: 100%;
  font-size: 12px;
  white-space: pre-line;
  border-collapse: collapse;
}
table td, table th {
  text-align:center;
  border: 1px solid #ccc;
}
`;
      newWindow.document.getElementsByTagName('head')[0].appendChild(styles);
      newWindow.print();
      newWindow.close();
    }
  },
  computed: {
    studentTableData() {
      return this.clazzData[this.query.clazzID];
    },
    teacherTableData() {
      return this.deptData[this.query.deptID];
    },
    teacherPersonalTableData() {
      return this.teacherPersonalData[this.query.teacherID];
    },
    downloadStudentExcel() {
      return downloadStudentExcelURL(this.query.scheduleID, this.query.collegeID)
    },
    downloadTeacherExcel() {
      return downloadTeacherExcelURL(this.query.scheduleID, this.query.collegeID)
    },
    downloadTeacherPersonalExcel() {
      return downloadTeacherPersonalExcelURL(this.query.scheduleID, this.query.teacherID)
    },
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
  white-space: pre-line;
}

.table * {
  white-space: pre-line;
}

.mr10 {
  margin-right: 10px;
}
</style>
<style>
/* noinspection  CssUnusedSymbol */
.table .cell {
  white-space: pre-line !important;
}
</style>