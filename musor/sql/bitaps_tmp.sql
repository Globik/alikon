-- \i /home/globik/alikon/sql/bitaps_tmp.sql
drop table bitaps_tmp;


create type brd_ptype as enum('single','hot'); 
create type bt_status_t as enum('anfang','paid','confirming');
create table bitaps_tmp(bt_inv_id varchar(100) not null,
						 addr varchar(100) not null,
						 p_c text not null,
						 bt_status bt_status_t not null default 'anfang',
						brd_pt brd_ptype not null,
						 bt_at timestamptz not null default now(),
				         bt_l_mod timestamptz not null default now(),
						 us_id varchar(24) not null,
						 bt_pck_tok int not null);
/*						 
insert into bitaps_tmp(bt_inv_id,addr,p_c,us_id,bt_pck_tok,bt_amount) values('12cb','adrsw','pm3','asuser',100,6000000);						 
select addr,bt_pck_tok, bt_amount from bitaps_tmp where us_id='asuser' and bt_status='anfang' 
and bt_pck_tok=100 and bt_at > NOW() - INTERVAL '120 minutes';
*/

 --drop function get_invoice(text,bt_status_t,int,text);
create or replace function get_invoice(usid varchar(24),status bt_status_t,pack int,zeit text)
returns table(addr varchar(100),bt_pck_tok int,bt_inv_id varchar(100)) as $$
begin
return query select bitaps_tmp.addr,bitaps_tmp.bt_pck_tok,bitaps_tmp.bt_inv_id 
from bitaps_tmp where us_id=usid and bt_status=status and bitaps_tmp.bt_pck_tok=pack
 and bt_at > NOW() - ($4 || ' minutes')::interval;
end;
$$
language plpgsql;

-- select * from get_invoice('asuser','anfang',100,'20');
-- with bitaps_cb.sql
--insert into bitaps_tmp(bt_inv_id,addr,p_c,us_id,bt_pck_tok,bt_amount) values('inv66','adr55e','p_c333','58a1a78a406da007a696e917',100,6000000);
-- select bitaps_cb_proc('txh3w3','adr55e','inv66','p_c333',100000,4,'ptx55',0.0002,0.001,'58a1a78a406da007a696e917');