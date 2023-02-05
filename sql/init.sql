CREATE TABLE courses (
    course_id int PRIMARY KEY AUTO_INCREMENT,
    owner_id int NOT NULL,
    course_name varchar(100)
);

CREATE TABLE lectures (
	lecture_id int PRIMARY KEY AUTO_INCREMENT,
    course_id int NOT NULL,
    title varchar(100),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE users (
	user_id int PRIMARY KEY AUTO_INCREMENT,
    netid varchar(24) NOT NULL,
    first_name varchar(255),
    last_name varchar(255),
    password varchar(30) NOT NULL
);

CREATE TABLE roles (
	role_id int PRIMARY KEY AUTO_INCREMENT,
    course_id int NOT NULL,
    user_id int NOT NULL,
    role enum('PROFESSOR', 'TA', 'STUDENT') NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE messages (
	message_id int PRIMARY KEY AUTO_INCREMENT,
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
	poll_id int PRIMARY KEY AUTO_INCREMENT,
    sender_id int NOT NULL,
    lecture_id int NOT NULL,
    timestamp datetime NOT NULL,
    question_text varchar(512),
    is_open boolean,
    close_date datetime,
    FOREIGN KEY (sender_id) REFERENCES users(user_id),
	FOREIGN KEY (lecture_id) REFERENCES lectures(lecture_id)
);

CREATE TABLE poll_choices (
	poll_choice_id int PRIMARY KEY AUTO_INCREMENT,
    poll_id int NOT NULL,
    choice_text varchar(256) NOT NULL,
    is_correct_choice bool NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES polls(poll_id)
);

CREATE TABLE poll_responses (
	poll_response_id int PRIMARY KEY AUTO_INCREMENT,
    user_id int,
    response_id int,
    poll_id int NOT NULL,
    timestamp datetime NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES polls(poll_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (response_id) REFERENCES poll_choices(poll_choice_id)
);

--Also include original filename?
CREATE TABLE media_metadata (
    media_id varchar(36) PRIMARY KEY,
    file_type varchar(5),
    course_id int NOT NULL,
    message_id int NOT NULL,
    user_id int NOT NULL,
    received boolean NOT NULL,
    timestamp datetime NOT NULL
);

SET GLOBAL time_zone = 'UTC';

INSERT INTO courses (course_id, owner_id, course_name) VALUES ('1', '1', 'Lib 160');
INSERT INTO courses (course_id, owner_id, course_name) VALUES ('2', '2', 'CPRE 491');



INSERT INTO lectures (lecture_id, course_id, title)
VALUES ('1', (select course_id from courses where course_name='Lib 160'), 'Lib 160 Lecture 1');
INSERT INTO lectures (lecture_id, course_id, title)
VALUES ('2', (select course_id from courses where course_name='CPRE 491'), 'CPRE 491 Lecture 1');



INSERT INTO users (user_id, netid, password) VALUES ('123', 'maruf', 'maruf');
INSERT INTO users (user_id, netid, password) VALUES ('1234', 'maruf_TA', 'maruf_TA');
INSERT INTO users (user_id, netid, password) VALUES ('12345', 'student', 'student');



INSERT INTO roles (role_id, course_id, user_id, role)
VALUES ('1',
(select course_id from courses where course_name='Lib 160'),
(select user_id from users where netid='maruf'),
'PROFESSOR');

INSERT INTO roles (role_id, course_id, user_id, role)
VALUES ('2',
(select course_id from courses where course_name='Lib 160'),
(select user_id from users where netid='maruf_TA'),
'TA');

INSERT INTO roles (role_id, course_id, user_id, role)
VALUES ('3',
(select course_id from courses where course_name='Lib 160'),
(select user_id from users where netid='student'),
'STUDENT');



INSERT INTO messages (message_id, sender_id, lecture_id, timestamp, body)
VALUES ('1',
(select user_id from users where netid='maruf'),
(select lecture_id from lectures where title='Lib 160 Lecture 1'),
CURRENT_TIMESTAMP, 'Hello students, this message is from the Prof' );

INSERT INTO messages (message_id, sender_id, lecture_id, timestamp, body)
VALUES ('2',
(select user_id from users where netid='maruf_TA'),
(select lecture_id from lectures where title='Lib 160 Lecture 1'),
CURRENT_TIMESTAMP, 'Hello students, this message if from the TA' );

INSERT INTO messages (message_id, sender_id, lecture_id, timestamp, body)
VALUES ('3',
(select user_id from users where netid='student'),
(select lecture_id from lectures where title='Lib 160 Lecture 1'),
CURRENT_TIMESTAMP, 'Hello everyone' );



INSERT INTO polls (poll_id, sender_id, lecture_id, timestamp, question_text)
VALUES ('1', (select user_id from users where netid='maruf'),
(select lecture_id from lectures where title='Lib 160 Lecture 1'),
CURRENT_TIMESTAMP, 'What is 1+1?');

INSERT INTO polls (poll_id, sender_id, lecture_id, timestamp, question_text)
VALUES ('2', (select user_id from users where netid='maruf_TA'),
(select lecture_id from lectures where title='Lib 160 Lecture 1'),
CURRENT_TIMESTAMP, 'What is 2+2?');



INSERT INTO poll_responses (poll_response_id, response, poll_id)
VALUES ('1', 'The answer is B',
(select poll_id from polls where question_text='What is 1+1?'));

INSERT INTO poll_responses (poll_response_id, response, poll_id)
VALUES ('2', 'The answer is D',
(select poll_id from polls where question_text='What is 2+2?'));



INSERT INTO poll_choices (poll_choice_id, poll_id, choice_text, is_correct_choice)
VALUES ('1', (select poll_id from polls where question_text='What is 1+1?'),
'A) 1
 B) 2
 C) 3
 D) 4',
 FALSE);

INSERT INTO poll_choices (poll_choice_id, poll_id, choice_text, is_correct_choice)
VALUES ('2', (select poll_id from polls where question_text='What is 2+2?'),
'A) 1
 B) 2
 C) 3
 D) 4',
 FALSE);