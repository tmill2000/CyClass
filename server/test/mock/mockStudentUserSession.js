const studentSession = {
    userid: 1,
    sessionId: "isV9mhw70IJbRPWGcU+xYA==",
    user_roles: [
        {
            role_id: 1,
            course_id: 1,
            course_name: "CPRE492",
            role: "STUDENT"
        }
    ]
};

const professorSession = {
    userid: 1,
    sessionId: "isV9mhw70IJbRPWGcU+xYA==",
    user_roles: [
        {
            role_id: 1,
            course_id: 1,
            course_name: "CPRE492",
            role: "PROFESSOR"
        }
    ]
};

const noAssociationSession = {
    userid: 1,
    sessionId: "isV9mhw70IJbRPWGcU+xYA==",
    user_roles: []
};

module.exports = {
    studentSession,
    professorSession,
    noAssociationSession
};
