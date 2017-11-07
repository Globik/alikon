-- \i /home/globik/alikon/sql/bitaps_tmp.sql
/*
create table bitaps_temp(bt_inv_id text not null,
						 addr text not null,
						 p_c text not null,
						 bt_status text not null default 'anfang',
						 bt_at timestamp not null default now(),
				         bt_l_mod timestamp not null default now(),
						 us_id text not null,
						 bt_pck_tok int not null,
						 bt_amount bigint not null); -- a nado li?
						 
insert into bitaps_temp(bt_inv_id,addr,p_c,us_id,bt_pck_tok,bt_amount) values('12cb','adrsw','pm3','asuser',100,6000000);						 
select addr,bt_pck_tok, bt_amount from bitaps_temp where us_id='asuser' and bt_status='anfang' 
and bt_pck_tok=100 and bt_at > NOW() - INTERVAL '120 minutes';
*/
create or replace function get_invoice(usid text,status text,pack int,zeit text)
returns table(p_addr text,p_bt_pck_tok int) as $$
begin
return query select addr,bt_pck_tok from bitaps_temp where us_id=usid and bt_status=status and bt_pck_tok=pack
 and bt_at > NOW() - ($4 || ' minutes')::interval;
end;
$$
language plpgsql;

-- select * from get_invoice('asuser','anfang',100,'20');
-- with bitaps_cb.sql
-- insert into bitaps_temp(bt_inv_id,addr,p_c,us_id,bt_pck_tok,bt_amount) values('inv66','adr55e','p_c333','58a1a78a406da007a696e917',100,6000000);
-- select bitaps_cb_proc('txh3w3','adr55e','inv66','p_c333',100000,4,'ptx55',0.0002,0.001,'58a1a78a406da007a696e917');