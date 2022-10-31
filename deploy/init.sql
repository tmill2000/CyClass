DROP TABLE poll_responses;
DROP TABLE poll_choices;
DROP TABLE polls;
DROP TABLE messages;
DROP TABLE roles;
DROP TABLE users;
DROP TABLE lectures;
DROP TABLE courses;

CREATE TABLE courses (
    course_id int PRIMARY KEY,
    owner_id int NOT NULL,
    course_name varchar(100)
);

CREATE TABLE lectures (
	lecture_id int PRIMARY KEY,
    course_id int NOT NULL,
    title varchar(100),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE users (
	user_id int PRIMARY KEY,
    netid varchar(24) NOT NULL,
    password varchar(30) NOT NULL
);

CREATE TABLE roles (
	role_id int PRIMARY KEY,
    course_id int NOT NULL,
    user_id int NOT NULL,
    role enum('PROFESSOR', 'TA', 'STUDENT') NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE messages (
	message_id int PRIMARY KEY,
    parent_id int,
    sender_id int NOT NULL,
    lecture_id int NOT NULL,
    timestamp datetime NOT NULL,
    message_title varchar(100),
    is_anonymous boolean,
    body varchar(1024),
    FOREIGN KEY (sender_id) REFERENCES users(user_id),
    FOREIGN KEY (lecture_id) REFERENCES lectures(lecture_id)
);

CREATE TABLE polls (
	poll_id int PRIMARY KEY,
    sender_id int NOT NULL,
    lecture_id int NOT NULL,
    timestamp datetime NOT NULL,
    question_text varchar(512),
    FOREIGN KEY (sender_id) REFERENCES users(user_id),
	FOREIGN KEY (lecture_id) REFERENCES lectures(lecture_id)
);

CREATE TABLE poll_choices (
	poll_choice_id int PRIMARY KEY,
    poll_id int NOT NULL,
    choice_text varchar(256) NOT NULL,
    is_correct_choice bool NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES polls(poll_id)
);

CREATE TABLE poll_responses (
	poll_response_id int PRIMARY KEY,
    user_id int,
    response_id int,
    poll_id int NOT NULL,
    timestamp datetime NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES polls(poll_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (response_id) REFERENCES poll_choices(poll_choice_id)
);
INSERT INTO users (user_id, netid, password) VALUES ('1', 'twmiller', 'pw');
