-- \i /home/globik/alikon/sql/reedem.sql
-- see https://bitaps.com/api
create table reedem(rd_id serial primary key,
					rd_at timestamptz not null default now(), -- when?
					rd_lm timestamptz not null default now(), --  last update
					rd_c varchar(1000) not null, --reedem_code encrypted
					rd_adr varchar(100) not null, -- address
					rd_inv varchar(60) not null, --invite
					rd_cold_adr varchar(60) not null default 'no',
					rd_t varchar(1) not null default 'i',  -- i=idempotent,a-active,p-passive
				    rd_b float not null default 0); -- balance - all money in + out
-- rd_c rd_adr rd_inv