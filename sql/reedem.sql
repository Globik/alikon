-- \i /home/globik/alikon/sql/reedem.sql
-- see https://bitaps.com/api
create table reedem(red_id serial primary key,
					red_at timestamptz not null default now(), -- when?
					rlm timestamptz not null default now(), --  last update
					red_c varchar(1000) not null, --reedem_code encrypted
					red_adr varchar(100) not null, -- address
					red_inv varchar(60) not null, --invite
					red_t boolean not null default false,  -- active or passive
				    red_b float not null default 0); -- balance
-- red_c red_adr red_inv