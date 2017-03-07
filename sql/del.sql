--  \i /home/globik/alikon/sql/del.sql
--delete from session;
--delete from busers where role='not_member';
-- B1yqWJycg
update articles set images=jsonb_set(images,'{0,title}','"F new TITLE1!!!"') where id=13;
--select images->'content' from articles where images @>'[{"id":"B1yqWJycg"}]';