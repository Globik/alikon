-- \i /home/globik/alikon/sql/users.sql
 create extension if not exists pgcrypto;
create table busers(
id varchar(24) primary key not null default generate_object_id(),
email text check(email ~*'^.+@.+\..+$'), --unique
pwd text not null check(length(pwd)<512),
role text not null default 'not_member', -- admin,superadmin,moderator,not_member // todo: type enum
verif boolean not null default false, -- is email address verified
name varchar(24) not null, --unique nickname of a user
mjoind timestamp not null default now()::timestamp, -- when has registred
items int not null default 0, --tokens
w_items bigint not null default 0, -- satoshi : if not enough bitcoins for a purchasing a token please move satoshi to this field
	-- and save it. Next time if satoshi > 10 token's "price" so give to the user some tokens(how much dependents on calculations
    -- see bitaps_cb.sql)
-- model ? -- todo: remove this stuff or mot?
bstatus text not null default 'no', -- some thing like banned status of a user //todo: type enum 
buser_d jsonb not null default '{}'); -- meta info(where to find what and other stuff, actual info etc)

-- insert into busers(email,pwd,role,verif,name)
--alter table busers add column model boolean default false;??
-- update busers set buser_d=jsonb_set(buser_d,'{ban_id}','6') where name='globik';