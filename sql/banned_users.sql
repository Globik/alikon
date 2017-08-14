-- \i /home/globik/alikon/sql/banned_users.sql
create table banned_users(id serial primary key,
						  us_id text not null references busers(id),
						  us_by int not null references team(id),
						  at timestamp not null default now(),
						  last_edit timestamp not null default now(),
						  grund text,
						  status text --not null,
						 bstatus text not null default 'waiting');
CREATE OR REPLACE FUNCTION banned_event() RETURNS TRIGGER AS $$
BEGIN
IF(TG_OP = 'UPDATE') THEN
update busers set bstatus=new.status where busers.id=new.us_id;
RETURN new;
ELSIF(TG_OP = 'INSERT') THEN
update busers set bstatus=new.status where busers.id=new.us_id;
RETURN new;
END IF;
RETURN null;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS banned ON banned_users;

CREATE TRIGGER  banned AFTER INSERT OR UPDATE ON banned_users FOR EACH ROW EXECUTE PROCEDURE banned_event();
insert into banned_users(us_id,us_by,status) values('58ea81aa5204c81bb9113e6a','58a1a78a406da007a696e917','yes');