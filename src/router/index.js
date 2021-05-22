import {createRouter, createWebHistory} from "vue-router";
import Home from "../views/home.vue";

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    }, {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                meta: {
                    title: '系统首页'
                },
                component: () => import (
                    /* webpackChunkName: "dashboard" */
                    "../views/dashboard.vue")
            }, {
                path: "/table",
                name: "basetable",
                meta: {
                    title: '表格'
                },
                component: () => import (
                    /* webpackChunkName: "table" */
                    "../views/raw/BaseTable.vue")
            }, {
                path: "/charts",
                name: "basecharts",
                meta: {
                    title: '图表'
                },
                component: () => import (
                    /* webpackChunkName: "charts" */
                    "../views/raw/BaseCharts.vue")
            }, {
                path: "/form",
                name: "baseform",
                meta: {
                    title: '表单'
                },
                component: () => import (
                    /* webpackChunkName: "form" */
                    "../views/raw/BaseForm.vue")
            }, {
                path: "/tabs",
                name: "tabs",
                meta: {
                    title: 'tab标签'
                },
                component: () => import (
                    /* webpackChunkName: "tabs" */
                    "../views/raw/Tabs.vue")
            }, {
                path: "/donate",
                name: "donate",
                meta: {
                    title: '鼓励作者'
                },
                component: () => import (
                    /* webpackChunkName: "donate" */
                    "../views/raw/Donate.vue")
            }, {
                path: "/permission",
                name: "permission",
                meta: {
                    title: '权限管理',
                    permission: true
                },
                component: () => import (
                    /* webpackChunkName: "permission" */
                    "../views/raw/Permission.vue")
            }, {
                path: "/i18n",
                name: "i18n",
                meta: {
                    title: '国际化语言'
                },
                component: () => import (
                    /* webpackChunkName: "i18n" */
                    "../views/raw/I18n.vue")
            }, {
                path: "/upload",
                name: "upload",
                meta: {
                    title: '上传插件'
                },
                component: () => import (
                    /* webpackChunkName: "upload" */
                    "../views/raw/Upload.vue")
            }, {
                path: "/icon",
                name: "icon",
                meta: {
                    title: '自定义图标'
                },
                component: () => import (
                    /* webpackChunkName: "icon" */
                    "../views/raw/Icon.vue")
            },
            {
                path: '/404',
                name: '404',
                meta: {
                    title: '找不到页面'
                },
                component: () => import (/* webpackChunkName: "404" */
                    '../views/404.vue')
            }, {
                path: '/403',
                name: '403',
                meta: {
                    title: '没有权限'
                },
                component: () => import (/* webpackChunkName: "403" */
                    '../views/403.vue')
            },

            {
                path: "/user",
                name: "user",
                meta: {
                    title: '帐号管理'
                },
                component: () => import (
                    /* webpackChunkName: "user" */
                    "../views/user.vue")
            },


            {
                path: "/course",
                name: "course",
                meta: {
                    title: '课程管理'
                },
                component: () => import (
                    /* webpackChunkName: "course" */
                    "../views/course.vue")
            },
            {
                path: "/department",
                name: "department",
                meta: {
                    title: '院系管理'
                },
                component: () => import (
                    /* webpackChunkName: "department" */
                    "../views/department.vue")
            },
            {
                path: "/teacher",
                name: "teacher",
                meta: {
                    title: '教师管理'
                },
                component: () => import (
                    /* webpackChunkName: "teacher" */
                    "../views/teacher.vue")
            },
            {
                path: "/class",
                name: "class",
                meta: {
                    title: '班级管理'
                },
                component: () => import (
                    /* webpackChunkName: "class" */
                    "../views/class.vue")
            },
            {
                path: "/course.json",
                name: "course.json",
                meta: {
                    title: '课程管理'
                },
                component: () => import (
                    /* webpackChunkName: "course.json" */
                    "../views/course.vue")
            },
            {
                path: "/instruct",
                name: "instruct.json",
                meta: {
                    title: '开课管理'
                },
                component: () => import (
                    /* webpackChunkName: "instruct" */
                    "../views/instruct.vue")
            },
            {
                path: "/term",
                name: "term",
                meta: {
                    title: '学期管理'
                },
                component: () => import (
                    /* webpackChunkName: "term" */
                    "../views/semester.vue")
            },
            {
                path: "/backup",
                name: "backup",
                meta: {
                    title: '备份'
                },
                component: () => import (
                    /* webpackChunkName: "backup" */
                    "../views/backup.vue")
            },
            {
                path: "/scheduling",
                name: "scheduling",
                meta: {
                    title: '课程排表'
                },
                component: () => import (
                    /* webpackChunkName: "scheduling" */
                    "../views/scheduling.vue")
            },
            {
                path: "/classroom",
                name: "classroom",
                meta: {
                    title: '教室管理'
                },
                component: () => import (
                    /* webpackChunkName: "classroom" */
                    "../views/classroom.vue")
            },
        ]
    }, {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import (
            /* webpackChunkName: "login" */
            "../views/login.vue")
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | 课程排表系统`;
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin'
            ? next()
            : next('/403');
    } else {
        next();
    }
});

export default router;