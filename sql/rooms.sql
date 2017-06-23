-- \i /home/globik/alikon/sql/rooms.sql
create table rooms(id text not null,
				  email text not null references busers(email),
				  status text not null default 'm',
				  view int not null default 0,
				  src text not null default 'no');
create or replace function log_rooms() returns trigger as $$
declare 
data json;
notification json;
begin
if(tg_op='delete') then
data=row_to_json(old);
else
data=row_to_json(new);
end if;
notification = json_build_object('table',tg_table_name,'action',tg_op,'data',data);
perform pg_notify('log_rooms',notification::text);
return null;
end;
$$ language plpgsql;
drop trigger if exists l_log_rooms on rooms;
create trigger l_log_rooms after insert or update or delete on rooms for each row execute procedure log_rooms();
-- 58ea81aa5204c81bb9113e6a dima@yandex.ru
-- 58eae2c641bc970a67ee4acc  ag1@yandex.ru
-- select*from busers inner join rooms on busers.email=rooms.email;