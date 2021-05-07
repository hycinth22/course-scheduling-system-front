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
          <el-submenu :index="item.index" :key="item.index">
            <template #title>
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                  v-if="subItem.subs"
                  :index="subItem.index"
                  :key="subItem.index"
              >
                <template #title>{{ subItem.title }}</template>
                <el-menu-item
                    v-for="(threeItem, i) in subItem.subs"
                    :key="i"
                    :index="threeItem.index"
                >{{ threeItem.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item
                  v-else
                  :index="subItem.index"
                  :key="subItem.index"
              >{{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
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
    return {
      items: [
        {
          icon: "el-icon-lx-home",
          index: "dashboard",
          title: "系统首页"
        },
        {
          icon: "el-icon-lx-calendar",
          index: "course",
          title: "课程信息管理"
        },
        {
          icon: "el-icon-lx-location",
          index: "classroom",
          title: "教室信息管理"
        },
        {
          icon: "el-icon-lx-addressbook",
          index: "department",
          title: "院系信息管理"
        },
        {
          icon: "el-icon-lx-people",
          index: "teacher",
          title: "教师个人信息"
        },
        {
          icon: "el-icon-lx-group",
          title: "学生班级信息",
          index: "class",
        },
        {
          icon: "el-icon-lx-tag",
          index: "term",
          title: "学期管理"
        },
        {
          icon: "el-icon-lx-profile",
          index: "instruct",
          title: "开课与选课信息"
        },
        {
          icon: "el-icon-lx-cascades",
          index: "scheduling",
          title: "自动排表"
        },
        {
          icon: "el-icon-lx-peoplefill",
          index: "user",
          title: "帐号管理"
        },
        {
          icon: "el-icon-lx-file",
          index: "backup",
          title: "数据备份"
        },

        //  {
        //    icon: "el-icon-lx-copy",
        //    index: "tabs",
        //    title: "tab选项卡"
        //  },
        //  {
        //    icon: "el-icon-lx-calendar",
        //    index: "3",
        //    title: "表单相关",
        //    subs: [
        //      {
        //        index: "form",
        //        title: "基本表单"
        //      },
        //      //         {
        //      //             index: "3-2",
        //      //             title: "三级菜单",
        //      //             subs: [
        //      //                 {
        //      //                     index: "editor",
        //      //                     title: "富文本编辑器"
        //      //                 },
        //      //                 {
        //      //                     index: "markdown",
        //      //                     title: "markdown编辑器"
        //      //                 }
        //      //             ]
        //      //         },
        //      {
        //        index: "upload",
        //        title: "文件上传"
        //      }
        //    ]
        //  },
        //  {
        //    icon: "el-icon-lx-emoji",
        //    index: "icon",
        //    title: "自定义图标"
        //  },
        //  {
        //    icon: "el-icon-pie-chart",
        //    index: "charts",
        //    title: "schart图表"
        //  },
        //  // {
        //  //     icon: "el-icon-rank",
        //  //     index: "6",
        //  //     title: "拖拽组件",
        //  //     subs: [
        //  //         {
        //  //             index: "drag",
        //  //             title: "拖拽列表"
        //  //         },
        //  //         {
        //  //             index: "dialog",
        //  //             title: "拖拽弹框"
        //  //         }
        //  //     ]
        //  // },
        //  //{
        //  //  icon: "el-icon-lx-global",
        //  // index: "i18n",
        //  //  title: "国际化功能"
        // // },
        //  {
        //    icon: "el-icon-lx-warn",
        //    index: "7",
        //    title: "错误处理",
        //    subs: [
        //      {
        //        index: "permission",
        //        title: "权限测试"
        //      },
        //      {
        //        index: "404",
        //        title: "404页面"
        //      }
        //    ]
        //  },
        //  {
        //    icon: "el-icon-lx-redpacket_fill",
        //    index: "/donate",
        //    title: "支持作者"
        //  }
      ]
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
    collapse() {
      return this.$store.state.collapse
    }
  }
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
