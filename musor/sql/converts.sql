-- \i  /home/globik/alikon/sql/converts.sql
/*
drop type if exists tok_status_enum cascade;
create type tok_status_enum as enum('waiting','complete','fail');
create table converts(us_id text not null,
					  amt_tok int not null,
					  at timestamp not null default now(),
					  lmod timestamp not null default now(),
					  status tok_status_enum not null default 'waiting',
					  constraint unique_us_id unique(us_id));
					  
--insert into converts(us_id,amt_tok) values('gru5@yandex.ru',1008);
				  
create or replace function check_opportunity() returns trigger as $check_opportunity$
begin
if new.amt_tok < 1000 then
raise exception 'Minimum 1000 tokens required.';
end if;
if not exists(select 1 from cards where us_id=new.us_id) then
raise exception 'You have no bitcoin address registered.';
end if;
if exists(select 1 from busers where email=new.us_id and model=false) then
raise exception 'You are not a model. Go claim yourself as a model.';
end if;
return new;
end;
$check_opportunity$
language plpgsql;

create trigger check_opportunity before insert on converts for each row execute procedure check_opportunity();
*/
/* for development */
/*
create table conv(us_id text not null,
					  amt_tok int not null,
					  at timestamp not null default now(),
					  lmod timestamp not null default now(),
					  status tok_status_enum not null default 'waiting',
				  proz float not null default 0.5
				 );
		*/	
		/*
insert into conv(us_id,amt_tok) values('gru5@yandex.ru',1008);
insert into conv(us_id,amt_tok) values('ag1@yandex.ru',2004);
insert into conv(us_id,amt_tok) values('ag2@yandex.ru',2000);
insert into conv(us_id,amt_tok) values('ag3@ya.ru',5000);
insert into conv(us_id,amt_tok) values('ag4@ya.ru',3003);

insert into conv(us_id,amt_tok,proz) values('ag5@ya.ru',2000,0.8);
insert into conv(us_id,amt_tok,proz) values('ag6@ya.ru',2000,0.8);
insert into conv(us_id,amt_tok,proz) values('ag7@ya.ru',2000,0.8);
insert into conv(us_id,amt_tok,proz) values('ag8@ya.ru',2000,0.8);
insert into conv(us_id,amt_tok,proz) values('ag9@ya.ru',2000,0.8);

insert into conv(us_id,amt_tok,proz) values('ag10@ya.ru',8000,0.5);
insert into conv(us_id,amt_tok,proz) values('ag11@ya.ru',7000,0.5);
insert into conv(us_id,amt_tok,proz) values('ag12@ya.ru',2000,0.8);
insert into conv(us_id,amt_tok,proz) values('ag13@ya.ru',7000,0.8);
insert into conv(us_id,amt_tok,proz) values('ag14@ya.ru',1000,0.5);

insert into conv(us_id,amt_tok,proz) values('ag15@ya.ru',2400,0.5);
insert into conv(us_id,amt_tok,proz) values('ag16@ya.ru',2070,0.8);
insert into conv(us_id,amt_tok,proz) values('ag17@ya.ru',2000,0.5);
insert into conv(us_id,amt_tok,proz) values('ag18@ya.ru',2000,0.8);
insert into conv(us_id,amt_tok,proz) values('ag19@ya.ru',1500,0.5);
*/
--cards
create table cardi(id serial primary key,
				   us_id text not null,
				   at timestamp not null default now(),
				   addr text not null,
				   lmod timestamp not null default now());
				   
insert into cardi(addr,us_id) values('acas','ag2@yandex.ru');
insert into cardi(addr,us_id) values('aas','ag3@ya.ru');
insert into cardi(addr,us_id) values('asas','ag4@ya.ru');
insert into cardi(addr,us_id) values('aa5s','ag5@ya.ru');
insert into cardi(addr,us_id) values('aacs','ag6@ya.ru');

insert into cardi(addr,us_id) values('aas7','ag7@ya.ru');
insert into cardi(addr,us_id) values('aas8','ag8@ya.ru');
insert into cardi(addr,us_id) values('aas9','ag9@ya.ru');
insert into cardi(addr,us_id) values('aas10','ag10@ya.ru');
insert into cardi(addr,us_id) values('aas11','ag11@ya.ru');

insert into cardi(addr,us_id) values('aas12','ag12@ya.ru');
insert into cardi(addr,us_id) values('aas13','ag13@ya.ru');
insert into cardi(addr,us_id) values('aas14','ag14@ya.ru');
insert into cardi(addr,us_id) values('aas15','ag15@ya.ru');
insert into cardi(addr,us_id) values('aas16','ag16@ya.ru');

insert into cardi(addr,us_id) values('aas17','ag17@ya.ru');
insert into cardi(addr,us_id) values('aas18','ag18@ya.ru');
insert into cardi(addr,us_id) values('aas19','ag19@ya.ru');

insert into cardi(addr,us_id) values('ad1','ag1@yandex.ru');
insert into cardi(addr,us_id) values('gru5','gru5@yandex.ru');


















