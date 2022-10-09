CREATE TABLE IF NOT EXISTS users (
    userId varchar(25) unique not null,
    name varchar(256) not null,
    username varchar(256) unique not null,
    email varchar(256) unique not null,
    password varchar(256) not null,
    date date not null,
    profileImage json,
    type varchar(24) not null,
    status varchar default='Offline',
    color varchar(16),
    startHour int(2) not null,
    startMinutes int(2) not null,
    endHour int(2) not null,
    endMinutes int(2) not null
);