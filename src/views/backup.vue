<template>
  <div class="container">
    <div class="handle-box">
      <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd" class="">备份当前数据</el-button>
      <el-divider></el-divider>
      上传备份数据:
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
          <div class="el-upload__tip">只能上传 sql 文件</div>
        </template>
      </el-upload>
    </div>
    <el-divider></el-divider>
    <el-select v-model="value" placeholder="请选择一项备份" class="mr10">
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>
    <div class="handle-box">
      <el-button type="plain" icon="el-icon-lx-back" @click="handleAdd" class="">下载此数据</el-button>
      <el-button type="plain" icon="el-icon-lx-back" @click="handleAdd" class="">使用此数据还原</el-button>
      <el-button type="danger" icon="el-icon-lx-delete" @click="handleAdd" class="">删除此数据</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [{
        value: '2021_05_16_13_01_03.74479.sql',
        label: '2021_05_16_13_01_03.74479.sql'
      }, {
        value: '2021_05_16_13_01_35.02421.sql',
        label: '2021_05_16_13_01_35.02421.sql'
      }, {
        value: '2021_05_16_13_01_45.81887.sql',
        label: '2021_05_16_13_01_45.81887.sql'
      }],
      value: ''
    }
  }
}
</script>

<style scoped>
.mr10 {
  margin-right: 10px;
}
.handle-box{
  margin-top: 10px;
}
</style>