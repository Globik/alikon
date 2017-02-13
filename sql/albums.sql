-- \i /home/globik/alikon/sql/albums.sql
alter table albums drop constraint unique_title;
drop table albums;
create table albums(id varchar(24) not null default generate_object_id(),
							   title varchar(255) not null,
							   us_data jsonb,
							   created timestamp not null default now(),
				   constraint unique_title unique(title));
insert into albums(title, us_data) values ('mama','{"multi":"true","us_id":"ff20"}');