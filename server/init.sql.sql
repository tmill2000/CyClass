CREATE TABLE courses (
    id int PRIMARY KEY,
    owner_id int NOT NULL,
    course_name varchar(100)
);

CREATE TABLE lectures (
	id int PRIMARY KEY,
    course_id int NOT NULL,
    title varchar(100),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE message (
	id int PRIMARY KEY,
    sender_id int NOT NULL,
    lecture_id int,
    timestamp datetime,
    body varchar(1024),
    FOREIGN KEY (lecture_id) REFERENCES lectures(id)
);

CREATE TABLE roles (
	id int PRIMARY KEY,
    course_id int NOT NULL,
    role enum('PROFESSOR', 'TA', 'STUDENT') NOT NULL,
    user_id int NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE users (
	id int PRIMARY KEY,
    netid varchar(24), -- This long enough???
    password varchar(30) NOT NULL
);






