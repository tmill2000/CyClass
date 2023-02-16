const studentSession = {
    userId: 1,
    sessionId: "isV9mhw70IJbRPWGcU+xYA==",
    user_roles: [
        {
            "role_id": 1,
            "course_id": 1,
            "course_name": "CPRE492",
            "role": "STUDENT"
        }
    ]
}

const professorSession = {
    userId: 1,
    sessionId: "isV9mhw70IJbRPWGcU+xYA==",
    user_roles: [
        {
            "role_id": 1,
            "course_id": 1,
            "course_name": "CPRE492",
            "role": "PROFESSOR"
        }
    ]
}

const noAssociationSession = {
    userId: 1,
    sessionId: "isV9mhw70IJbRPWGcU+xYA==",
    user_roles: []
}

module.exports = {
    studentSession,
    professorSession,
    noAssociationSession
}