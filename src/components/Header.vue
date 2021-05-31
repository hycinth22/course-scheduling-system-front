<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChange">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">课程排表系统</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 消息中心 -->
<!--                <div class="btn-bell">-->
<!--                    <el-tooltip-->
<!--                        effect="dark"-->
<!--                        :content="message?`有${message}条未读消息`:`消息中心`"-->
<!--                        placement="bottom"-->
<!--                    >-->
<!--                        <router-link to="/tabs">-->
<!--                            <i class="el-icon-bell"></i>-->
<!--                        </router-link>-->
<!--                    </el-tooltip>-->
<!--                    <span class="btn-bell-badge" v-if="message"></span>-->
<!--                </div>-->
                <!-- 用户头像 -->
                <div class="user-avatar">
                    <img src="../assets/img/img.jpg" alt="user-avatar"/>
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
<!--                            <a href="https://github.com/lin-xin/vue-manage-system" target="_blank">-->
<!--                                <el-dropdown-item>项目仓库</el-dropdown-item>-->
<!--                            </a>-->
                            <el-dropdown-item> 登录用户名：{{username}}</el-dropdown-item>
                            <el-dropdown-item divided v-if="user && user.associated_teacher"> 职工号：{{user.associated_teacher}}</el-dropdown-item>
                            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
import {getUser} from "../login_state";
export default {
    data() {
        return {
            fullscreen: false,
            name: "linxin",
            message: 2
        };
    },
    computed: {
        username() {
            let username = localStorage.getItem("ms_username");
            return username ? username : this.name;
        },
        collapse() {
            return this.$store.state.collapse;
        },
        user() {
          return getUser();
        },
    },
    methods: {
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            if (command === "loginout") {
                localStorage.removeItem("ms_username");
                this.$router.push("/login");
            }
        },
        // 侧边栏折叠
        collapseChange() {
            this.$store.commit("handleCollapse", !this.collapse);
        }
    },
    mounted() {
        if (document.body.clientWidth < 1500) {
            this.collapseChange();
        }
    }
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
    width: 250px;
    line-height: 70px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.user-name {
    margin-left: 10px;
}
.user-avatar {
    margin-left: 20px;
}
.user-avatar img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}

</style>
