-- \i /home/globik/alikon/sql/reedem.sql
-- see https://bitaps.com/api
create table reedem(red_id serial primary key,
					red_at timestamptz not null default now(), -- when?
					rlm timestamptz not null default now(), --  last update
					red_c text not null, --reedem_code encrypted
					red_adr text not null, -- address
					red_inv text not null, --invite
					red_t text not null default 'pass',  -- act,pass
				   red_b numeric not null default 0); -- balance
-- red_c red_adr red_inv