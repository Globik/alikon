-- \i /home/globik/alikon/sql/objectid.sql
-- rob.conery.io/2014/05/29/a-better-id-generator-for-postgresql/
-- create schema shard_1
create sequence global_id_sequence;
create or replace function id_generator(out result bigint) as $$
declare
	our_epoch bigint := 1314220021721;
	seq_id bigint;
	now_millis bigint;
	shard_id int :=1;
begin
	select nextval('global_id_sequence') % 1024 into seq_id;
	select floor(extract(epoch from clock_timestamp())* 1000) into now_millis;
	result := (now_millis - our_epoch) << 23;
	result := result | (shard_id << 10);
	result := result | (seq_id);
end;
$$ language plpgsql;