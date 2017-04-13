-- \i  /home/globik/alikon/sql/converts.sql

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
