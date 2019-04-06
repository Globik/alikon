-- \i /home/globik/alikon/sql/abuse.sql

create table abuse(abus_id varchar(24) not null references busers(id),
				   ab_type text not null default 'neu',
				   ab_at timestamp not null default now(),
				   ab_l_mod timestamp not null default now(),
				   ab_cnt int not null default 1,
				   ab_cmt varchar(250),
				   ab_slc varchar(250) not null,
				   constraint unique_abus_id unique(abus_id));
				   
-- d.selector=a;d.text=b;d.us_id=c;d.who=e;
-- //(abus_id,ab_slc,ab_cmt)
-- //abus_id,ab_type,ab_at,ab_l_mod,ab_cnt,ab_cmt,ab_slc
-- insert into abuse(abus_id,ab_slc,ab_cmt) values('58a1a78a406da007a696e917','nn','cmt');
-- 
--insert into abuse(abus_id,ab_slc,ab_cmt) values('58a1a78a406da007a696e917','nn','cmt') on conflict(abus_id) do update set ab_cnt=abuse.ab_cnt+1;
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

