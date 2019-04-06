-- \i /home/globik/alikon/sql/cards.sql

create table cards(id serial primary key,
				   us_id text not null references busers(id) on delete cascade on update cascade,
				   at timestamp not null default now(),
				   addr text not null,
				   lmod timestamp not null default now(),
				   constraint unique_user_id unique(us_id));
--insert into cards(addr,us_id) values('aa','ag1@yandex.ru') on conflict(us_id) do update set addr='baba',lmod=now();