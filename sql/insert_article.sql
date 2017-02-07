-- \i /home/globik/alikon/sql/insert_article.sql

insert into articles(title,slug,author,body) values('Mama','mama','Globik',
'Hello text. <h1>Haupt text</h1><button onclick="do()">clickme</button><script>function do(){alert("ok");}</script>');