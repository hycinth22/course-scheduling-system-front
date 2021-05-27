import request from "../utils/request";
import {getURL} from "../utils/request";

export const listSchedulesInSemester = (semester_date) => {
    return request({
        url: '/schedule',
        method: 'get',
        params: {
            semester_date: semester_date
        }
    });
};

export const createNewSchedule = (semester_date, evaluatorKeys) => {
    return request({
        url: '/schedule/new',
        method: 'get',
        params: {
            semester_date: semester_date,
            evaluators: evaluatorKeys,
        },
        timeout: 60000,
    });
};

export const listSchedulesItems = (schedule_id) => {
    return request({
        url: '/schedule/' + schedule_id + "/items",
        method: 'get',
        params: {}
    });
};

export const listSchedulesItemsGroupView = (schedule_id) => {
    return request({
        url: '/schedule/' + schedule_id + "/items/group_view",
        method: 'get',
        params: {}
    });
};

export const deleteSchedule = (schedule_id) => {
    return request({
        url: '/schedule/' + schedule_id,
        method: 'delete',
        params: {},
    });
};

export const deleteScheduleInSemester = (semester_date) => {
    return request({
        url: '/schedule/',
        method: 'delete',
        params: {
            semester_date: semester_date,
        },
    });
};

export const downloadStudentExcelURL = (schedule_id, college_id) => {
    return getURL('/schedule/' + schedule_id + "/student_excel?college_id=" + college_id);
};

export const downloadTeacherExcelURL = (schedule_id, college_id) => {
    return getURL('/schedule/' + schedule_id + "/teacher_excel?college_id=" + college_id);
};

export const downloadTeacherPersonalExcelURL = (schedule_id, teacher_id) => {
    return getURL('/schedule/' + schedule_id + "/teacher_personal_excel/?teacher_id=" + teacher_id);
};

export const saveSelectedSchedule = (semester_date, schedule_id) => {
    return request({
        url: '/schedule/selected',
        method: 'put',
        params: {
            semester: semester_date,
            schedule: schedule_id,
        },
    });
};

export const getEvaluatorList = () => {
    return request({
        url: '/schedule/evaluator_list',
        method: 'get',
        params: {},
    });
};

