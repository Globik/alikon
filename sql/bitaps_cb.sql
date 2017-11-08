-- \i /home/globik/alikon/sql/bitaps_cb.sql
/*
insert into bitaps_temp(bt_inv_id,addr,p_c,us_id,bt_pck_tok,bt_amount) values('inv66','adr55e','p_c333','58a1a78a406da007a696e917',100,6000000);

*/
--  select bitaps_cb_proc('txh3w3','adr55e','inv66','p_c333',100000,4,'ptx55',0.0002,0.001,'58a1a78a406da007a696e917');

/*
drop table bitaps_cb;
create table bitaps_cb(tx_h text not null, -- tx_hash
					   adr text not null, --address
					   inv text not null, --invoice
					   p_c text not null, --code
					   amt bigint not null, --amount (in satoshi)
					   cnf int not null, -- confirmations
					   p_tx_h text not null, -- payout_tx_hash
					   p_m_f float not null, -- payout_miner_fee
					   p_s_f float not null, -- payout_service_fee
					   cb_us_id varchar(24) not null references busers(id),
					   cb_at timestamptz not null default now(),
					   l_at timestamptz not null default now(),
					   pack int not null,
					   prom_pack int not null default 0,
					   cb_n int not null default 0,
					  constraint unique_inv_id unique(inv));
					   */
create or replace function bitaps_cb_proc(tx_h text,adr text,inv text,p_c text,
										 amt bigint,cnf int,p_tx_h text,
										 p_m_f float,p_s_f float,
										 cb_us_id varchar(24)) returns void
language plpgsql as $$
declare
p_pack int;
muck int;
_dolg bigint;
_vdolg int;
_promdolg int :=0;
begin
if exists(select 1 from bitaps_temp where bitaps_temp.p_c=bitaps_cb_proc.p_c) then
select trunc(bitaps_cb_proc.amt/40000) into p_pack;

insert into bitaps_cb(tx_h,adr,inv,p_c,amt,cnf,p_tx_h,p_m_f,p_s_f,cb_us_id,pack) values(
	bitaps_cb_proc.tx_h,bitaps_cb_proc.adr,bitaps_cb_proc.inv,bitaps_cb_proc.p_c,bitaps_cb_proc.amt,
	bitaps_cb_proc.cnf,bitaps_cb_proc.p_tx_h,bitaps_cb_proc.p_m_f,bitaps_cb_proc.p_s_f,
bitaps_cb_proc.cb_us_id,p_pack) on conflict on constraint unique_inv_id do update 
set cb_n=bitaps_cb.cb_n + 1, l_at=now(), cnf=bitaps_cb_proc.cnf;
	
select bitaps_cb.cb_n from bitaps_cb where bitaps_cb.inv=bitaps_cb_proc.inv into muck; 
	-- if bitaps_cb.cb_n==1
if muck = 0 then
update bitaps_temp set bt_status='paid', bt_l_mod=now() where bitaps_temp.p_c=bitaps_cb_proc.p_c;
perform pg_notify('bitaps_ok',json_build_object('us_id',bitaps_cb_proc.cb_us_id,'items',p_pack,'type','paid')::text);

elsif muck = 1 then
update busers set items=busers.items + p_pack where busers.id=bitaps_cb_proc.cb_us_id;
perform pg_notify('bitaps_ok',json_build_object('us_id',bitaps_cb_proc.cb_us_id,'items',p_pack,'type','do_ok')::text);

if p_pack = 0 then
update busers set w_items=busers.w_items + bitaps_cb_proc.amt where busers.id=bitaps_cb_proc.cb_us_id;
end if;

select w_items from busers where busers.id=bitaps_cb_proc.cb_us_id into _dolg;
if _dolg > 100000 then
select trunc(_dolg/40000) into _vdolg;
update busers set items=busers.items + _vdolg,w_items=busers.w_items - _dolg where busers.id=bitaps_cb_proc.cb_us_id;
update bitaps_cb set prom_pack=bitaps_cb.prom_pack + _vdolg where bitaps_cb.inv=bitaps_cb_proc.inv;
end if;

update bitaps_temp set bt_status='confirming',bt_l_mod=now() where bitaps_temp.p_c=bitaps_cb_proc.p_c;
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
	
	delete from bitaps_temp where bitaps_temp.p_c=bitaps_cb_proc.p_c;
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
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
					   