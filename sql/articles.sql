-- \i /home/globik/alikon/sql/articles.sql
drop table articles;
create table articles(id serial primary key ,
					  title text not null check(length(title)<512),
					  sub_title text not null default '',
					  slug text not null,
					  author text,
					  created_on timestamp not null default now()::timestamp,
					  slogan text,
					  description text check(length(description)<512),
					  leader text,
					  body text not null,
					  foto_cover text,
					  category text,
					  rubrik text,
					  images jsonb not null default '{}',
					  gesamt_seen integer default 0,
					  last_modified timestamp not null default now()::timestamp,
					  date_url date not null default current_date,
					  part int not null default 0,
					  status text not null default 'active');
-- insert into articles(title,slug,author,body)