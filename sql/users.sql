-- \i /home/globik/alikon/sql/users.sql
create extension if not exists pgcrypto;
create table busers(
email text primary key check(email ~* '^.+@.+\..+$'),
pwd text not null check(length(pwd)<512),
role text not null default 'not_member',
verif boolean not null default false,
name text not null,
mjoind timestamp not null default now()::timestamp);
-- CREATE TABLE
-- insert into busers(email,pwd,role,verif,name) values('your_email@gmail.com',crypt('pass',gen_salt('bf',8)),'superadmin',  true, 'k');