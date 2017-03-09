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
insert into images(
B1yqWJycg  | some title |     | HkcWNk0Ye | gru5@yandex.ru | 58a1a78a406da007a696e917/hosp-m4-k1.jpg | 58a1a78a406da007a696e917/hosp-m4-k2.jpg | 58a1a78a406da007a696e917/hosp-m4-k3.jpg | 58a1a78a406da007a696e917/hosp-m4-k4.jpg | {"ino1": 28442694, "ino2": 28442695, "ino3": 28442696, "ino4": 28442697, "alb_ids": {"HkcWNk0Ye": 1}, "alb_title": {"mama": 1}} | 2017-02-25 05:50:47.498121
 rye1cZkk9e | some title |     | HkcWNk0Ye | gru5@yandex.ru | 58a1a78a406da007a696e917/blum-m4-k1.jpg | 58a1a78a406da007a696e917/blum-m4-k2.jpg | 58a1a78a406da007a696e917/blum-m4-k3.jpg | 58a1a78a406da007a696e917/blum-m4-k4.jpg | {"ino1": 28442690, "ino2": 28442691, "ino3": 28442692, "ino4": 28442693, "alb_ids": {"HkcWNk0Ye": 1}, "alb_title": {"mama": 1}} | 2017-02-25 05:50:47.498121


