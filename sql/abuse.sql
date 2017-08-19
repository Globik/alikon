-- \i /home/globik/alikon/sql/abuse.sql

create table abuse(id serial primary key,
				   slc text not null,
				   cmnt text,
				   us_id varchar(24) not null references busers(id),
				   by_nick text not null,
				   status text not null default 'neu',-- ok, gone
				   at timestamp not null default now(),
				   mngr varchar(24) references team(adm_id),
				   at_t timestamp);
				   
-- d.selector=a;d.text=b;d.us_id=c;d.who=e;
-- (slc,cmnt,us_id,by_nick)
/*
create or replace function pagi(in _sess int) returns record as $$
declare r1 record;
declare r2 record;
declare result record;
begin
select array_agg(sq.*) as arr into r1
from(select t.* from abuse t where t.status='neu') sq;
select*from banners into r2;
select r1.arr,r2 into result;
return result;
end;
$$ language plpgsql;
*/
-- select abuse.*,banners.* from banners,abuse where abuse.status='neu'; not wished
--select json_agg(json_build_array(abuse.*)) as fr from abuse;
--select json_agg(json_build_array(abuse.*)) from abuse;
--select json_agg(json_build_array(abuse.*)) from abuse where status='neu';

