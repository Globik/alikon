-- \i /home/globik/alikon/sql/banned_users.sql
drop table banned_users;
create table banned_users(ban_id serial primary key,
						  bn_us_id text not null references busers(id),
						  bn_us_by varchar(24) not null references team(adm_id),
						  bn_at timestamp not null default now(),
						  bn_last_edit timestamp not null default now(),
						  bn_cmt text,
						  bn_slc varchar(200),
						  bn_status text not null, --not null must be yes or no,
						  bstatus text not null default 'waiting');
CREATE OR REPLACE FUNCTION banned_event() RETURNS TRIGGER AS $$

BEGIN
IF(TG_OP = 'UPDATE') THEN

--update busers set bstatus=new.bn_status, buser_d=jsonb_set(buser_d,'{banistik}',jsonb_build_object('ban_id',new.ban_id)) where 
--busers.id=new.bn_us_id;
update busers set bstatus=new.bn_status,buser_d=jsonb_set(buser_d,'{ban_id}',to_jsonb(new.ban_id::int)) where busers.id=new.bn_us_id;
RETURN new;
ELSIF(TG_OP = 'INSERT') THEN

--update busers set bstatus=new.bn_status, buser_d=jsonb_set(buser_d,'{banistik}',jsonb_build_object('ban_id',new.ban_id)) where busers.id=new.bn_us_id;
update busers set bstatus=new.bn_status,buser_d=jsonb_set(buser_d,'{ban_id}',to_jsonb(new.ban_id::int)) where busers.id=new.bn_us_id;
-- update busers set buser_d=jsonb_set(buser_d,'{ban_id}','6') where name='globik';

-- insert into banned_users(bn_us_id,bn_us_by,bn_status) values('58ea81aa5204c81bb9113e6a','58a1a78a406da007a696e917','yes');
-- update banned_users set bstatus='fuck',bn_status='no' where ban_id=1;



--update busers set buser_d=jsonb_set(buser_d,'{ban_id}',jsonb_build_object('ban_id','mama'));
--update busers set buser_d=jsonb_set(buser_d,'{ban_id}','mama'::jsonb);
--update busers set buser_d=jsonb_build_object('ban_id','mama');

--update busers set buser_d=buser_d->'ban_id' || jsonb_build_object('man_id','mama');

delete from abuse where abus_id=new.bn_us_id;
RETURN new;
END IF;
RETURN null;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS banned ON banned_users;

CREATE TRIGGER  banned AFTER INSERT OR UPDATE ON banned_users FOR EACH ROW EXECUTE PROCEDURE banned_event();
--insert into banned_users(bn_us_id,bn_us_by,bn_status,bn_cmt,bn_slc) values('58ea81aa5204c81bb9113e6a',1,'yes');
-- insert into banned_users(bn_us_id,bn_us_by,bn_status) values('58ea81aa5204c81bb9113e6a','58a1a78a406da007a696e917','yes');
/*
select busers.id,busers.name,busers.role,busers.verif,busers.model,busers.items,busers.bstatus,rooms.src,abuse.* 
from busers left join rooms on busers.name=rooms.room_name left join  abuse on abuse.abus_id=busers.id where busers.name='globik' and 
exists(select*from abuse where abuse.ab_type='neu') limit 1;

select busers.id,busers.name,busers.role,busers.verif,busers.model,busers.items,busers.bstatus,rooms.src,abuse.* 
from busers left join rooms on busers.name=rooms.room_name left join  abuse on abuse.abus_id=busers.id where busers.name='globik' and 
exists(select*from abuse where abuse.ab_type='neu') limit 1;
*/