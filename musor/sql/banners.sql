-- \i /home/globik/alikon/sql/banners.sql

create table banners(
	id serial primary key,
	alt text,
	href text not null,
	src text not null,
	cust_id int not null default 1,
	active boolean default false,
	cr_at timestamp not null default now(),
	start text,
	endi text,
	l_mod timestamp not null default now(),
	type text not null, -- main, sidebar
	title text not null default 'Nokia',
	hits int not null default 0,
	click int not  null default 0);
	
insert into banners(href,src,type) values('http://nokia.com','/images/emblema-a.svg','sidebar');