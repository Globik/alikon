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
					rd_t rd_type not null default 'i',  -- i=idempotent,a-active,p-passive
				    rd_b float not null default 0); -- balance - all money in + out
-- rd_c rd_adr rd_inv