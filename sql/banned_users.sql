-- \i /home/globik/alikon/sql/banned_users.sql
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
update busers set bstatus=new.bn_status where busers.id=new.bn_us_id;
RETURN new;
ELSIF(TG_OP = 'INSERT') THEN
update busers set bstatus=new.bn_status where busers.id=new.bn_us_id;
delete from abuse where abus_id=new.bn_us_id;
RETURN new;
END IF;
RETURN null;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS banned ON banned_users;

CREATE TRIGGER  banned AFTER INSERT OR UPDATE ON banned_users FOR EACH ROW EXECUTE PROCEDURE banned_event();
--insert into banned_users(bn_us_id,bn_us_by,bn_status,bn_cmt,bn_slc) values('58ea81aa5204c81bb9113e6a',1,'yes');