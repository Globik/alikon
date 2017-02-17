-- \i /home/globik/alikon/sql/users.sql
create extension if not exists pgcrypto;
create table busers(
id varchar(24) not null default generate_object_id(),
email text primary check(email ~* '^.+@.+\..+$'),
pwd text not null check(length(pwd)<512),
role text not null default 'not_member',
verif boolean not null default false,
name text not null,
mjoind timestamp not null default now()::timestamp);
-- CREATE TABLE
-- insert into busers(email,pwd,role,verif,name) values('gru5@yandex.ru',crypt('b****',gen_salt('bf',8)),'superadmin',  true, 'k');