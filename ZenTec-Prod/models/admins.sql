CREATE DATABASE IF NOT EXISTS admins;
USE admins;

CREATE TABLE users (
    _id varchar(25) unique not null,
    name varchar(64) not null,
    username varchar(64) unique not null,
    email varchar(128) unique not null,
    password varchar(256) not null
 
);