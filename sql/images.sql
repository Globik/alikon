-- \i /home/globik/alikon/sql/images.sql
--drop table images;

create table images(id varchar(24) not null default generate_object_id(),
                                            --title text,
                                            img_dsc text,
                                            alb_id text not null,
                                           -- alb_title text not null,
                                            us_id text not null references busers(email) on delete cascade on update cascade,
                                            src1 text,
                                            src2 text,
                                            src3 text,
                                            src4 text,
					                        srama jsonb,
                                            created timestamp not null default now(),
                                            constraint unique_src unique(src1)
                                            ); 
--insert into images(alb_id,alb_title,us_id,src1,src2,src3,src4) values('fed0','mama','gru5@yandex.ru','src1.png','src2.png','src3.png','src4.png');
--insert into images(alb_id,alb_title,us_id,src1,src2,src3,src4) values('fed0','mama','gru5@yandex.ru','mir_1.png','mir_2.png','mir_3.png','mir_4.png');


