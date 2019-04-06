-- \i /home/globik/alikon/sql/ban_act.sql
create table ban_act(
	ban_id text not null,
	alt text,
	href text not null,
	src text not null,
	title text not null,
    type text not null);