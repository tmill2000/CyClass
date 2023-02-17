const hasCoursePermissions = (courseId, session) => {
    if(!session.user_roles){
        return false;
    }
    const [course] = session.user_roles.filter((role) => Number(role?.course_id) === Number(courseId))
    return course?.role === 'PROFESSOR' || course?.role === 'TA'
}

const isInCourse = (courseId, session) => {
    if(!session.user_roles){
        return false;
    }
    const [course] = session.user_roles.filter((role) => Number(role?.course_id) === Number(courseId))
    return course?.role === 'PROFESSOR' || course?.role === 'TA' || course?.role === 'STUDENT'
}

module.exports = { hasCoursePermissions, isInCourse }