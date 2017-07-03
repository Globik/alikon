-- \i /home/globik/alikon/sql/seats.sql
create table seats(pid text not null,
				   us_id text not null references busers(email) on delete cascade on update cascade,
				   start timestamp not null default now(),
				   vend timestamp,
				   type int not null default 0)