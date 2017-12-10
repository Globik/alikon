-- \i /home/globik/alikon/sql/reedem.sql
-- see https://bitaps.com/api
-- drop type if exists rd_type cascade;

create type rd_type as enum('i','a','p'); 
create table reedem(rd_id serial primary key,
					rd_at timestamptz not null default now(), -- when?
					rd_lm timestamptz not null default now(), --  last update
					rd_c varchar(1000) not null, --reedem_code encrypted
					rd_adr varchar(100) not null, -- address
					rd_inv varchar(60) not null, --invite
					rd_cold_adr varchar(60) not null default 'no',
					rd_t rd_type not null default 'i',  -- i=idempotent,a=active,p=passive
				    rd_b float not null default 0); -- balance - all money in + out
					
-- rd_c rd_adr rd_inv
create or replace function bitaps_update_rd_type(rd_t rd_type,rd_cold_adr varchar(60),rd_id int) returns void
language plpgsql as $$
declare
_id int;
begin
if $1 = 'a' then
select reedem.rd_id into _id from reedem where reedem.rd_t='a';
if not found then
update reedem set rd_t=$1,rd_cold_adr=$2,rd_lm=now() where reedem.rd_id=$3;
else
raise exception 'There is already reedem code A. Type A must be unique. %', _id;
end if;
else
update reedem set rd_t=$1,rd_cold_adr=$2,rd_lm=now() where reedem.rd_id=$3;
end if;
end;
$$;
--select bitaps_update_rd_type('a','adress',20);