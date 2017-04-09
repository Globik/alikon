-- \i /home/globik/alikon/sql/cards.sql

create table cards(id serial primary key,
				   us_id text not null references busers(email),
				   at timestamp not null default now(),
				   addr text,
				   lmod timestamp);
	