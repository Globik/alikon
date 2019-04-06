-- \i /home/globik/alikon/sql/chat.sql
 create table chat(id serial primary key,msg text,tz timestamptz not null default now(),chat_name text references busers(name),
				   us_name text not null);
-- insert into chat(msg,chat_name) values('hello','globik');
CREATE OR REPLACE FUNCTION expire_chat_delete_old_rows() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
DELETE FROM chat WHERE chat_name=NEW.chat_name AND tz < NOW() - INTERVAL '12 minutes';
RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS expire_chat_delete_old_rows_trigger ON chat;
CREATE TRIGGER expire_chat_delete_old_rows_trigger AFTER INSERT ON chat FOR EACH ROW EXECUTE PROCEDURE expire_chat_delete_old_rows();