-- \i /home/globik/alikon/sql/aud_team.sql
create table aud_team(id serial primary key,
					  us_id text not null references busers(id),
					  type text,
					  action text,
					  status text,
					  at timestamp not null default now(),
					  us_by text not null,
					  mark text,role text);
-- (us_id,action,status,us_by,mark,type,role)