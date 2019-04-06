-- \i /home/globik/alikon/sql/notify-trigger.sql
create or replace function notify_banner() returns trigger as $$
declare 
id bigint;
begin
if tg_op='insert' or tg_op='update' then
id=new.id;
else
id=old.id;
end if;
if tg_op='update' then
perform pg_notify('table_update',json_build_obj('schema',tg_table_schema,
												'table',tg_table_name,
												'id',id,
												'type',tg_op,
												hstore_to_json(hstore(new) - hstore(old)))::text);
return new;
end if;
if tg_op='insert' then
perform pg_notify('table_update',json_build_obj('schema',tg_table_schema,
												'table',tg_table_name,
												'id',id,
												'type',tg_op,
												'row',row_to_json(new))::text);
return new;
end if;
if tg_op='delete' then
perform pg_notify('table_update',json_build_obj('schema',tg_table_schema,
												'table',tg_table_name,
												'id',id,
												'type',tg_op,
												'row',row_to_json(old))::text);
return old;
end if;
end;
$$ language plpgsql;
create trigger notif_banner after insert or update or delete on banners for each row execute procedure notify_banner()