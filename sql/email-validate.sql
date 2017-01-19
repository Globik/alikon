-- \i /home/globik/alikon/sql/email-validate.sql
create or replace function send_validation() returns trigger
language plpgsql as $$
declare
tok uuid;
begin
select uuid_generate_v4() into tok;
insert into tokens(token, token_type, email) values(tok, 'validation', new.email);
perform pg_notify('validate', json_build_object('email', new.email, 'token', tok, 'token_type', 'validation')::text);
return new;
end
$$;
drop trigger if exists send_validation on busers;
create trigger send_validation after insert on busers
for each row execute procedure send_validation();

create or replace function say_yes_email(token uuid) returns void
language plpgsql as $$
declare tok uuid;
begin
if exists(select 1 from tokens where tokens.token=say_yes_email.token
		  and token_type='validation') then
update busers set verif=true where busers.email=(select email from tokens where tokens.token=say_yes_email.token and token_type='validation');
perform pg_notify('validate', json_build_object('email',
(select email from tokens where tokens.token=say_yes_email.token and token_type='validation'),
														  'token_type','validated')::text);
		  delete from tokens where tokens.token=say_yes_email.token and token_type='validation';
		  else
		  raise invalid_password using message='Invalid email validation';
		  end if;
		  
		  end;
		  $$;
		  