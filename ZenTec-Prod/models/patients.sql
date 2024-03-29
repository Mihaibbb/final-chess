CREATE TABLE IF NOT EXISTS patients ( 
    _id varchar(24) primary key not null,
    firstname varchar(256) not null,
    lastname varchar(256) not null, 
    phone varchar(16) unique not null,
    birthdate date not null,
    fileNumber int(11) unique not null,
    username varchar(64) unique,
    email varchar(256) unique,
    cnp varchar(32) unique,
    gender varchar(32),
    profileImage json,
    address text,
    doctors json,
    city varchar(58),
    county varchar(58),
    country varchar(56),
    date date not null,
    historic json
);