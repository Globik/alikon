-- \i /home/globik/alikon/sql/transfer.sql
--drop table transfer;
create table transfer(id serial primary key,
					  tfrom text not null references busers(email),
					  tos text not null references busers(email),
					  amount int not null,
					  at timestamp not null default now(),
					  type int not null,
					  pid text not null);
					  
					  
					  
					  /*
create table ruser(id serial primary key,
				   name text not null,
				   items int not null default 0);*/
--insert into ruser(name,items) values('globik',100);
--insert into ruser(name) values('alik');
--insert into  transfer(tfrom, tos, amount,type) values('gru5@yandex.ru','ag1@yandex.ru',30,1);

CREATE OR REPLACE FUNCTION balance_event() RETURNS TRIGGER AS $$
BEGIN
IF(TG_OP = 'UPDATE') THEN
--INSERT INTO emp_audit(empname, salary) values('updating', 200);
RETURN new;
ELSIF(TG_OP = 'INSERT') THEN
update busers set items=items+new.amount where busers.email=new.tos;
update busers set items=items-new.amount where busers.email=new.tfrom;
RETURN new;
END IF;
RETURN null;
END;
$$ LANGUAGE plpgsql;

 -- DROP TRIGGER  IF EXISTS products_notify_event ON cars;
DROP TRIGGER IF EXISTS notif_balance ON transfer;

CREATE TRIGGER  notif_balance
AFTER INSERT OR UPDATE ON transfer
FOR EACH ROW EXECUTE PROCEDURE balance_event();