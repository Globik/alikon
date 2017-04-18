-- \i /home/globik/alikon/sql/payouts.sql
create table payouts(id serial primary key,
					 us_id text not null,
					 at timestamp not null default now(),
					 status text,
					 amt_tok int not null,
					 amt_usd float not null,
					 amt_bc float not null,
					 proz float not null,
					 adr text not null);
-- us_id, status,amt_tok,amt_usd,amt_bc,proz,adr