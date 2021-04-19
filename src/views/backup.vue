<template>
  <div class="container">
    <div class="handle-box">
      <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd" class="mr10">备份当前数据</el-button>
    </div>
    <el-divider></el-divider>
    <el-select v-model="value" placeholder="请选择一项备份">
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>
    <div class="handle-box">
      <el-button type="plain" icon="el-icon-lx-down" @click="handleAdd" class="mr10">下载选中数据</el-button>
      <el-button type="plain" icon="el-icon-lx-back" @click="handleAdd" class="mr10">使用选中数据还原</el-button>
      <el-button type="danger" icon="el-icon-lx-delete" @click="handleAdd" class="mr10">删除选中数据</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [{
        value: '选项1',
        label: '选项1'
      }, {
        value: '选项2',
        label: '选项2'
      }, {
        value: '选项3',
        label: '选项3'
      }, {
        value: '选项4',
        label: '选项4'
      }, {
        value: '选项5',
        label: '选项5'
      }],
      value: ''
    }
  }
}
</script>