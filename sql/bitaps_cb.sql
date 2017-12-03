-- \i /home/globik/alikon/sql/bitaps_cb.sql
-- see https://bitaps.com/api
/*
insert into bitaps_temp(bt_inv_id,addr,p_c,us_id,bt_pck_tok,bt_amount) values('inv66','adr55e','p_c333','58a1a78a406da007a696e917',100,40000);

*/
--  select bitaps_cb_proc('txh3w3','adr55e','inv66','paymCode6666',40000,3,'p_tx_h_666y',0.0002,0.0002,'58a1a78a406da007a696e917');
-- todo: dynamic price for one token. At the moment it has 40 000 satoshis(0.0004 btc) per token

drop table bitaps_cb;
create table bitaps_cb(tx_h text not null, -- tx_hash
					   adr text not null, --address todo: type varchar() remove type text
					   inv text not null, --invoice
					   p_c text not null, --code
					   amt bigint not null, --amount (in satoshi)
					   cnf int not null, -- confirmations
					   p_tx_h text not null, -- payout_tx_hash
					   p_m_f float not null, -- payout_miner_fee
					   p_s_f float not null, -- payout_service_fee
					   cb_us_id varchar(24) not null references busers(id),
					   cb_at timestamptz not null default now(), -- creating time
					   l_at timestamptz not null default now(), -- last modified
					   pack int not null, -- how much tokens 
			prom_pack int not null default 0, -- additional amount of tokens after recalculations on satoshi 'w_items' field in busers.sql
					   cb_n int not null default 0, -- an order number of a confirmation(incremental)
					  constraint unique_inv_id unique(inv));
					   
create or replace function bitaps_cb_proc(tx_h text,adr text,inv text,p_c text,
										 amt bigint,cnf int,p_tx_h text,
										 p_m_f float,p_s_f float,
										 cb_us_id varchar(24)) returns void
language plpgsql as $$
declare
p_pack int; -- amount of tokens(tips)
muck int; -- an order number of a given confirmation
_dolg bigint; -- a temporal variable to calculate satoshis in busers.w_items
_vdolg int; -- a temporal variable to calculate amount of tokens to give
_promdolg int :=0; -- a temporal value of additional tokens for bitaps_pays.sql storing
begin
-- must to check if payment_code exists in bitaps_tmp. Throw error if not.
if exists(select 1 from bitaps_tmp where bitaps_tmp.p_c=bitaps_cb_proc.p_c) then
select trunc(bitaps_cb_proc.amt/40000) into p_pack;

insert into bitaps_cb(tx_h,adr,inv,p_c,amt,cnf,p_tx_h,p_m_f,p_s_f,cb_us_id,pack) values(
	bitaps_cb_proc.tx_h,bitaps_cb_proc.adr,bitaps_cb_proc.inv,bitaps_cb_proc.p_c,bitaps_cb_proc.amt,
	bitaps_cb_proc.cnf,bitaps_cb_proc.p_tx_h,bitaps_cb_proc.p_m_f,bitaps_cb_proc.p_s_f,
bitaps_cb_proc.cb_us_id,p_pack) on conflict on constraint unique_inv_id do update 
set cb_n=bitaps_cb.cb_n + 1, l_at=now(), cnf=bitaps_cb_proc.cnf;
	
select bitaps_cb.cb_n from bitaps_cb where bitaps_cb.inv=bitaps_cb_proc.inv into muck; 
	-- if bitaps_cb.cb_n==1
if muck = 0 then
update bitaps_tmp set bt_status='paid', bt_l_mod=now() where bitaps_tmp.p_c=bitaps_cb_proc.p_c;
perform pg_notify('bitaps_ok',json_build_object('us_id',bitaps_cb_proc.cb_us_id,'items',p_pack,
	'inv_id',bitaps_cb_proc.inv,'bcamt',bitaps_cb_proc.amt,'type','paid')::text);

elsif muck = 1 then
update busers set items=busers.items + p_pack where busers.id=bitaps_cb_proc.cb_us_id;
perform pg_notify('bitaps_ok',json_build_object('us_id',bitaps_cb_proc.cb_us_id,'items',p_pack,
'inv_id',bitaps_cb_proc.inv,'bcamt',bitaps_cb_proc.amt,'type','do_ok')::text);
-- if not enough bitcoins for a token, but there are some satoshis - save it for the future!
if p_pack = 0 then
update busers set w_items=busers.w_items + bitaps_cb_proc.amt where busers.id=bitaps_cb_proc.cb_us_id;
end if;
-- asign satoshis to _dolg
select w_items from busers where busers.id=bitaps_cb_proc.cb_us_id into _dolg;
if _dolg > 160000 then
-- give to user some tokens

select trunc(_dolg/40000) into _vdolg;
update busers set items=busers.items + _vdolg,w_items=busers.w_items - _dolg where busers.id=bitaps_cb_proc.cb_us_id;
update bitaps_cb set prom_pack=bitaps_cb.prom_pack + _vdolg where bitaps_cb.inv=bitaps_cb_proc.inv;
end if;

update bitaps_tmp set bt_status='confirming',bt_l_mod=now() where bitaps_tmp.p_c=bitaps_cb_proc.p_c;
elsif muck = 3 then
select prom_pack from bitaps_cb where bitaps_cb.inv=bitaps_cb_proc.inv into _promdolg;
insert into bitaps_pays(tx_h,adr,inv,p_c,amt,cnf,p_tx_h,p_m_f,p_s_f,pus_id,pack) 
	values(bitaps_cb_proc.tx_h,
		   bitaps_cb_proc.adr,
		   bitaps_cb_proc.inv,
		   bitaps_cb_proc.p_c,
		   bitaps_cb_proc.amt,
		   bitaps_cb_proc.cnf,
		   bitaps_cb_proc.p_tx_h,
	       bitaps_cb_proc.p_m_f,
		   bitaps_cb_proc.p_s_f,
		   bitaps_cb_proc.cb_us_id,
		   p_pack + _promdolg);
	
	delete from bitaps_tmp where bitaps_tmp.p_c=bitaps_cb_proc.p_c;
	delete from bitaps_cb where bitaps_cb.inv=bitaps_cb_proc.inv;
	else
	
	end if;
	else
	raise exception 'wrong p_code request';
	end if;
	end;
	$$;
/*bitaps_cb_proc(tx_h text,adr text,inv text,p_c text,
										 amt bigint,cnf int,p_tx_h text,
										 p_m_f float,p_s_f float,
										 cb_us_id varchar(24)) */
--select bitaps_cb_proc('txh3w3','adr55e','inv66','p_c333',100000,4,'ptx55',0.0002,0.001,'58a1a78a406da007a696e917');				   