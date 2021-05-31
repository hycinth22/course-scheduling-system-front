<template>
  <div class="sidebar">
    <el-menu
        class="sidebar-el-menu"
        :default-active="onRoutes"
        :collapse="collapse"
        background-color="#324157"
        text-color="#bfcbd9"
        active-text-color="#20a0ff"
        unique-opened
        router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index" :disabled="!item.roles.includes(role)">
            <template #title>
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                  v-if="subItem.subs"
                  :index="subItem.index"
                  :key="subItem.index"
                  :disabled="!subItem.roles.includes(role)"
              >
                <template #title>{{ subItem.title }}</template>
                <el-menu-item
                    v-for="(threeItem, i) in subItem.subs"
                    :key="i"
                    :index="threeItem.index"
                    :disabled="!threeItem.roles.includes(role)"
                >{{ threeItem.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item
                  v-else
                  :index="subItem.index"
                  :key="subItem.index"
                  :disabled="!subItem.roles.includes(role)"
              >{{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index" :disabled="!item.roles.includes(role)">
            <i :class="item.icon"></i>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
// import bus from "../common.js/bus";
export default {
  data() {
    let profile = JSON.parse(localStorage.getItem("ms_userprofile"));
    return {
      role: profile.role,
      items: [
        {
          icon: "el-icon-lx-home",
          index: "dashboard",
          title: "系统首页",
          roles: ["admin", "operator", "teacher"],
        },
        {
          icon: "el-icon-lx-calendar",
          index: "course",
          title: "课程信息管理",
          roles: ["admin", "operator", "teacher"],
        },
        {
          icon: "el-icon-lx-location",
          index: "classroom",
          title: "教室信息管理",
          roles: ["admin", "operator", "teacher"],
        },
        {
          icon: "el-icon-lx-addressbook",
          title: "师生信息管理",
          roles: ["admin", "operator", "teacher"],
          subs: [
            {
              icon: "el-icon-lx-addressbook",
              index: "department",
              title: "院系信息管理",
              roles: ["admin", "operator", "teacher"],
            },
            {
              icon: "el-icon-lx-people",
              index: "teacher",
              title: "教师个人信息",
              roles: ["admin", "operator", "teacher"],
            },
            {
              icon: "el-icon-lx-group",
              title: "学生班级信息",
              index: "class",
              roles: ["admin", "operator", "teacher"],
            },
          ]
        },
        {
          icon: "el-icon-lx-tag",
          index: "term",
          title: "学期管理",
          roles: ["admin", "operator"],
        },
        {
          icon: "el-icon-lx-profile",
          index: "instruct",
          title: "开课与选课信息",
          roles: ["admin", "operator", "teacher"],
        },
        {
          icon: "el-icon-lx-cascades",
          index: "scheduling",
          title: "自动排表",
          roles: ["admin", "operator", "teacher"],
        },
        {
          icon: "el-icon-lx-peoplefill",
          index: "user",
          title: "帐号管理",
          roles: ["admin"],
        },
        {
          icon: "el-icon-lx-file",
          index: "backup",
          title: "数据备份",
          roles: ["admin"],
        },
      ]
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
    collapse() {
      return this.$store.state.collapse;
    },
  },
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar > ul {
  height: 100%;
}
</style>
