-- \i  /home/globik/alikon/sql/agenda.sql
create table agenda(id serial primary key,
			 name text not null,
			 data jsonb,
			 type text not null,
			 priority int,
			 repeatInterval text,
			 repeatTimezone text,
			 lastModifiedBy text,
			 nextRunAt text, --timestamp without time zone,
			 lockedAt text,
			disabled boolean default false);
		
			 
			 