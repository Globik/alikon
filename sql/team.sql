-- \i /home/globik/alikon/sql/team.sql
create table team(
				  adm_id varchar(24) not null primary key references busers(id),
				  role text not null,
				  status text not null default 'active',
				  at timestamp not null default now(),
				  us_by varchar(24) not null references busers(id),
				  mark text);
CREATE OR REPLACE FUNCTION set_moder_event() RETURNS TRIGGER AS $$
BEGIN
IF(TG_OP = 'UPDATE') THEN
update busers set role=new.role where busers.id=new.adm_id;
insert into aud_team(us_id,action,status,us_by,mark,type) values(new.adm_id,'update',new.status,new.us_by,new.mark,'who knows');
RETURN new;
ELSIF(TG_OP = 'INSERT') THEN
update busers set role=new.role where busers.id=new.adm_id;
insert into aud_team(us_id,action,status,us_by,mark,type) values(new.adm_id,'insert',new.status,new.us_by,new.mark,'who knows');
RETURN new;
ELSIF(TG_OP = 'DELETE') THEN
update busers set role='not' where busers.id=old.adm_id;
insert into aud_team(us_id,action,status,us_by,mark,type) values(old.adm_id,'delete',old.status,old.us_by,old.mark,'who knows');
RETURN old;
END IF;
RETURN null;
END;
$$ LANGUAGE plpgsql;
-- (us_id,action,status,us_by,mark,type)
-- insert into team(adm_id,role,us_by) values('58a1a78a406da007a696e917','superadmin','58a1a78a406da007a696e917');
DROP TRIGGER IF EXISTS set_moder ON team;

CREATE TRIGGER  set_moder AFTER INSERT OR UPDATE OR DELETE ON team FOR EACH ROW EXECUTE PROCEDURE set_moder_event();
				  