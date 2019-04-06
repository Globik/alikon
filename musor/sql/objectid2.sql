-- \i /home/globik/alikon/sql/objectid2.sql
-- gist.github.com/jamarparris/6100413
-- for a buser ID in busers.sql
create or replace function generate_object_id() returns varchar as $$
declare
	time_component bigint;
	machine_id bigint :=floor(random()*16777215);
	process_id bigint;
	seq_id bigint :=floor(random()*16777215);
	result varchar := '';
begin
	select floor(extract(epoch from clock_timestamp())) into time_component;
	select pg_backend_pid() into process_id;
	
	result := result || lpad(to_hex(time_component),8,'0');
	result := result || lpad(to_hex(machine_id),6,'0');
	result := result || lpad(to_hex(process_id),4,'0');
	result := result || lpad(to_hex(seq_id),6,'0');
	return result;
	end;
$$ language plpgsql;