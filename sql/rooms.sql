-- \i /home/globik/alikon/sql/rooms.sql
create table rooms(
				  room_name text not null references busers(name),
				  status text not null default 'm',
				  view int not null default 0,
				  src text not null default 'no');
		/*		  
CREATE OR REPLACE FUNCTION log_rooms() RETURNS TRIGGER AS $$
DECLARE 
data json;
notification json;
BEGIN
IF(TG_OP='DELETE') THEN
  data=row_to_json(OLD);
ELSE
data=row_to_json(NEW);
END IF;
notification = json_build_object('table',TG_TABLE_NAME,'action',TG_OP,'data',data);
PERFORM pg_notify('log_rooms',notification::text);
RETURN NULL;
END;
$$ LANGUAGE plpgsql;
*/
--drop trigger if exists l_log_rooms on rooms;
--CREATE TRIGGER l_log_rooms AFTER INSERT OR UPDATE OR DELETE ON rooms FOR EACH ROW EXECUTE PROCEDURE log_rooms();
-- 58ea81aa5204c81bb9113e6a dima@yandex.ru
-- 58eae2c641bc970a67ee4acc  ag1@yandex.ru
-- select*from busers inner join rooms on busers.email=rooms.email;