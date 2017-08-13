-- \i /home/globik/alikon/sql/users.sql
/* create extension if not exists pgcrypto;
create table busers(
id varchar(24) primary key not null default generate_object_id(),
email text check(email ~*'^.+@.+\..+$'), --unique
pwd text not null check(length(pwd)<512),
role text not null default 'not_member',
verif boolean not null default false,
name varchar(24) not null, --unique
mjoind timestamp not null default now()::timestamp);
*/
-- CREATE TABLE
-- insert into busers(email,pwd,role,verif,name) values('gru5@yandex.ru',crypt('b****',gen_salt('bf',8)),'superadmin',  true, 'k');
-- insert into busers(id,email,pwd,name) values('1','gru5@yandex.ru','kuku','globik');
-- alter table busers add column items int not null default 0;
-- alter table busers add column w_items int not null default 0;
--alter table busers add column model boolean default false;
alter table busers add column nick text not null default 'nick';
--alter table busers add column bstatus text not null default 'no';
-- alter table transfer add column pid text not null default 'aa';

-- drop primary key on email
-- alter table busers drop constraint busers_pkey cascade;
/*
drop cascades to constraint images_us_id_fkey on table images ok
drop cascades to constraint albums_us_id_fkey on table albums ok
drop cascades to constraint tokens_email_fkey on table tokens ok
drop cascades to constraint transfer_tfrom_fkey on table transfer ok
drop cascades to constraint transfer_tos_fkey on table transfer ok
drop cascades to constraint cards_us_id_fkey on table cards ok
drop cascades to constraint rooms_email_fkey on table rooms ok
drop cascades to constraint seats_us_id_fkey on table seats ok
*/
-- set new primary key on id
-- alter  table busers add primary key (id);
--add unique index on name
-- create unique index unique_name on busers(name);
-- create unique index unique_email on busers(email);
-- drop column nick
-- alter table busers drop column nick;
-- alter table images add constraint images_us_id_fkey foreign key (us_id) references busers(id) on delete cascade on update cascade;
-- alter table tokens add constraint tokens_email_fkey foreign key (email) references busers(email) on delete cascade on update cascade;
-- alter table transfer add constraint transfer_tfrom_fkey foreign key (tfrom) references busers(id) on delete cascade on update cascade;
-- alter table transfer add constraint transfer_tos_fkey foreign key (tos) references busers(id) on delete cascade on update cascade;
-- alter table cards add constraint cards_us_id_fkey foreign key (us_id) references busers(id) on delete cascade on update cascade;
-- alter table seats add constraint seats_us_id_fkey foreign key (us_id) references busers(id) on delete cascade on update cascade;
-- alter table busers alter column name type varchar(24);










