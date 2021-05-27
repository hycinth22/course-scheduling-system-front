<template>
  <div class="container" v-loading="loading">
    <div class="handle-box">
      <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd" class="">备份当前数据</el-button>
      <el-divider></el-divider>
      上传备份数据:
      <el-upload
          drag
          :action="uploadBackupURL"
          name="backupFile"
          multiple
          @on-change="uploadSuccess"
          accept=".sql"
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
    <el-select v-model="selected" placeholder="请选择一项备份" class="mr10 select1" size="medium">
      <el-option
          v-for="item in list"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>
    <el-link target="_blank" :href="downloadURL" :underline="true" icon="el-icon-lx-down" class="mr10">
      下载此数据
    </el-link>
    <div class="handle-box">
      <el-button type="plain" icon="el-icon-lx-forward" @click="handleRestore" class="">使用此数据还原</el-button>
        <el-popconfirm title="确定删除吗？" @confirm="handleDelete">
          <template #reference>
            <el-button type="danger" icon="el-icon-lx-delete">删除此数据</el-button>
          </template>
        </el-popconfirm>
    </div>
  </div>
</template>

<script>
import {uploadBackupURL, createBackup, delBackup, listBackups, downloadBackupURL, applyBackup} from "../api/backup"
export default {
  data() {
    return {
      list: [{
        value: '2021_05_16_13_01_03.74479.sql',
        label: '2021_05_16_13_01_03.74479.sql'
      }, {
        value: '2021_05_16_13_01_35.02421.sql',
        label: '2021_05_16_13_01_35.02421.sql'
      }, {
        value: '2021_05_16_13_01_45.81887.sql',
        label: '2021_05_16_13_01_45.81887.sql'
      }],
      selected: '',
      loading: false,
    }
  },
  computed: {
    uploadBackupURL() {
      return uploadBackupURL;
    },
    downloadURL() {
      return downloadBackupURL(this.selected);
    }
  },
  methods: {
    handleAdd() {
      this.loading = true;
      createBackup().then((resp)=>{
        this.loadList().then(()=>{
          this.loading = false;
          this.$message.success("新建备份成功，保存为 " + resp.filename);
        });
      });
    },
    handleDelete() {
      this.loading = true;
      delBackup(this.selected).then(()=>{
        this.loadList();
        this.selected = null;
        this.loading = false;
        this.$message.success("删除成功");
      });
    },
    handleRestore() {
      this.loading = true;
      applyBackup(this.selected).then(()=>{
        this.selected = null;
        this.loading = false;
        this.$message.success("恢复成功");
      });
    },
    uploadSuccess() {
      this.loading = true;
      this.loadList().then(()=>{
        this.loading = false;
      });
    },
    loadList() {
      return listBackups().then((resp)=>{
        this.list = resp.map((elem)=>{
          return {
            value: elem,
            label: elem
          }
        });
      });
    },
  },
  created() {
    this.loading = true;
    this.loadList().then(()=>{
      this.loading = false;
    });
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
.select1{
  width: 300px;
}
</style>