-- \i /home/globik/alikon/sql/abuse.sql
create table abuse(id serial primary key,
				   slc text not null,
				   cmnt text,
				   us_id varchar(24) not null references busers(id),
				   by_nick text not null,
				   status text not null default 'neu',
				   at timestamp not null default now(),
				   mngr varchar(24) references team(adm_id),
				   at_t timestamp);
-- d.selector=a;d.text=b;d.us_id=c;d.who=e;
-- (slc,cmnt,us_id,by_nick)