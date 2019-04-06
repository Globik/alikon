-- \i /home/globik/alikon/sql/articles.sql
drop table articles;
create table articles(id serial primary key ,
					  title text not null check(length(title)<512),
					  sub_title text not null default '',
					  slug text not null default '',
					  author text,
					  created_on timestamp not null default now()::timestamp,
					  slogan text not null default '',
					  description text check(length(description)<512),
					  leader text not null default '',
					  body text not null,
					  foto_cover text not null default '',
					  category text not null default '',
					  rubrik text not null default '',
					  images jsonb not null default '{}',
					  gesamt_seen integer default 0,
					  last_modified timestamp not null default now()::timestamp,
					  date_url date not null default current_date,
					  part int not null default 0,
					  status text not null default 'active',
					  type text not null default 'article');
-- insert into articles(title,slug,author,body)