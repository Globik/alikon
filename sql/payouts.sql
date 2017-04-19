-- \i /home/globik/alikon/sql/payouts.sql
/*create table payouts(id serial primary key,
					 us_id text not null,
					 at timestamp not null default now(),
					 status text,
					 amt_tok int not null,
					 amt_usd float not null,
					 amt_bc float not null,
					 proz float not null,
					 adr text not null);
					 */
-- us_id, status,amt_tok,amt_usd,amt_bc,proz,adr
create or replace function popa() returns json
language plpgsql as $$
declare
tokuser int;
tokmodel int;
mod float;
usod float;
total_usd float;
begin
select sum(amt_tok) from conv where proz=0.5 into tokuser;
select sum(amt_tok) from conv where proz=0.8 into tokmodel;
usod :=tokuser*0.1*0.5;
mod :=tokmodel*0.1*0.8;
total_usd :=usod+mod;
return json_build_object('tokuser',tokuser,'usod',usod,'tokmodel', tokmodel,'mod',mod,'total_usd',total_usd);
end;
$$;