<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-card shadow="hover">
        <schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card shadow="hover">
        <schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import Schart from "vue-schart";

export default {
  name: "dashboard",
  components: {
    Schart
  },
  data() {
    return {
      data: [
        {
          name: "2018/09/04",
          value: 1083
        },
        {
          name: "2018/09/05",
          value: 941
        },
        {
          name: "2018/09/06",
          value: 1139
        },
        {
          name: "2018/09/07",
          value: 816
        },
        {
          name: "2018/09/08",
          value: 327
        },
        {
          name: "2018/09/09",
          value: 228
        },
        {
          name: "2018/09/10",
          value: 1065
        }
      ],
      options: {
        type: "bar",
        title: {
          text: "最近一周图"
        },
        xRorate: 25,
        labels: ["周一", "周二", "周三", "周四", "周五"],
        datasets: [
          {
            label: "当天课程数",
            data: [234, 278, 270, 190, 230]
          },
          {
            label: "授课教师数",
            data: [164, 178, 190, 135, 160]
          },
          {
            label: "上课班级数",
            data: [144, 198, 150, 235, 120]
          }
        ]
      },
      options2: {
        type: "line",
        title: {
          text: "最近几个月趋势图"
        },
        labels: ["6月", "7月", "8月", "9月", "10月"],
        datasets: [
          {
            label: "当月课程数",
            data: [234, 278, 270, 190, 230]
          },
          {
            label: "授课教师数",
            data: [164, 178, 150, 135, 160]
          },
          {
            label: "上课班级数",
            data: [74, 118, 200, 235, 90]
          }
        ]
      }
    }
  },
}
</script>

<style>

.schart {
  width: 100%;
  height: 300px;
}
</style>
