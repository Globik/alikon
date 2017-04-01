-- \i /home/globik/alikon/sql/bitpay-info.sql
--create table bitpayers(infbp jsonb not null default '{}');
--create index j_idx on bitpayers using gin(infbp jsonb_path_ops);
--create unique index bp_id on bitpayers((infbp->>'id'));

--insert into bitpayers(infbp) values('{"id":"a","status":"paid"}');
--insert into bitpayers(infbp) values('{"id":"a","status":"confirmed"}') on conflict((infbp->>'id'::text)) do update
--set infbp=jsonb_set(bitpayers.infbp,'{status}','"confirmed"');

--insert into bitpayers(infbp) values('{"id":"a","status":"paid"}') on conflict((infbp->>'id'::text)) do update
--set infbp=jsonb_set(bitpayers.infbp,'{status}','"paid"') where bitpayers.infbp->>'status'  not like '%complete%';

--insert into bitpayers(infbp) values('{"id":"a","status":"complete","posData":"{\"items\":10}","buyerFields":"{\"buyerEmail\":\"gru5@yandex.ru\"}"}') 
--on conflict((infbp->>'id'::text)) do update set infbp=jsonb_set(bitpayers.infbp,'{status}','"complete"') where bitpayers.infbp->>'status' not like '%complete%';


create or replace function log_bitp() RETURNS TRIGGER AS $$
DECLARE
	data json;
	notification json;
BEGIN
	IF(TG_OP = 'DELETE') THEN
		data = row_to_json(OLD);
	ELSE
		data=row_to_json(NEW);
	END IF;
	notification = json_build_object('table', TG_TABLE_NAME, 'action', TG_OP, 'data', data);
PERFORM pg_notify('events_bitpay', notification::text);
RETURN NULL;
END;
$$ LANGUAGE plpgsql;

--drop function log_bitp();
drop trigger if exists l_log_bitp on bitpayers;
create trigger l_log_bitp after insert or update on bitpayers for each row execute procedure  log_bitp();


/*
 {"id": "4BJQ6scN6y1ekMrDtcGmVk", 
 "url": "https://test.bitpay.com/invoice?id=4BJQ6scN6y1ekMrDtcGmVk", 
 "rate": 1036.16, 
 "price": 1, 
 "btcDue": "0.000000", 
 "status": "paid", 
 "btcPaid": "0.000965", 
 "posData": "{\"ref\":\"referal-1342\"}", 
 "btcPrice": "0.000965", 
 "currency": "USD", 
 "buyerFields": {"buyerName": "Ali Boos"}, 
 "currentTime": 1490737697693, 
 "invoiceTime": 1490737380114, 
 "expirationTime": 1490738280114, "exceptionStatus": false}
 
 {"id": "4BJQ6scN6y1ekMrDtcGmVk", "url": "https://test.bitpay.com/invoice?id=4BJQ6scN6y1ekMrDtcGmVk",
 "rate": 1036.16, "price": 1, "btcDue": "0.000000", 
 "status": "complete", "btcPaid": "0.000965", 
 "posData": "{\"ref\":\"referal-1342\"}", "btcPrice": "0.000965", "currency": "USD", "buyerFields": {"buyerName": "Ali Boos"}, 
 "currentTime": 1490737758295, "invoiceTime": 1490737380114, "expirationTime": 1490738280114, "exceptionStatus": false}
 
 {"id": "qYvnJ31zL1XgASg3MUz82", "url": "https://test.bitpay.com/invoice?id=qYvnJ31zL1XgASg3MUz82", "rate": 1035.36, "price": 1,
 "btcDue": "0.000000", "status": "paid", "btcPaid": "0.000966", "posData": "{\"ref\":\"referal-1342\"}", "btcPrice": "0.000966",
 "currency": "USD", "buyerFields": {"buyerName": "Ali Boos"}, "currentTime": 1490739546744, "invoiceTime": 1490739383401,
 "expirationTime": 1490740283401, "exceptionStatus": false}
 
 {"id": "qYvnJ31zL1XgASg3MUz82", "url": "https://test.bitpay.com/invoice?id=qYvnJ31zL1XgASg3MUz82", "rate": 1035.36, "price": 1,
 "btcDue": "0.000000", "status": "confirmed", "btcPaid": "0.000966", "posData": "{\"ref\":\"referal-1342\"}", "btcPrice": "0.000966", 
 "currency": "USD", "buyerFields": {"buyerName": "Ali Boos"}, "currentTime": 1490739558457, "invoiceTime": 1490739383401,
 "expirationTime": 1490740283401, "exceptionStatus": false}
 
 {"id": "qYvnJ31zL1XgASg3MUz82", "url": "https://test.bitpay.com/invoice?id=qYvnJ31zL1XgASg3MUz82", "rate": 1035.36, "price": 1, 
 "btcDue": "0.000000", "status": "complete", "btcPaid": "0.000966", "posData": "{\"ref\":\"referal-1342\"}", "btcPrice": "0.000966", 
 "currency": "USD", "buyerFields": {"buyerName": "Ali Boos"}, "currentTime": 1490739618541, "invoiceTime": 1490739383401,
 "expirationTime": 1490740283401, "exceptionStatus": false}
 
 {"id": "NJtMHBjEKq69i3ANnyQoH6", "url": "https://test.bitpay.com/invoice?id=NJtMHBjEKq69i3ANnyQoH6", "rate": 1009.49, "price": 1, 
 "btcDue": "0.000000", "status": "paid", "btcPaid": "0.000991", "posData": "{\"ref\":\"referal-1342\"}", "btcPrice": "0.000991", "currency": "USD", "buyerFields": {"buyerName": "Ali Boos"}, "currentTime": 1490759110279, "invoiceTime": 1490758902121, "expirationTime": 1490759802121, "exceptionStatus": false}
 {"id": "NJtMHBjEKq69i3ANnyQoH6", "url": "https://test.bitpay.com/invoice?id=NJtMHBjEKq69i3ANnyQoH6", "rate": 1009.49, "price": 1, 
 "btcDue": "0.000000", "status": "complete", "btcPaid": "0.000991", "posData": "{\"ref\":\"referal-1342\"}", "btcPrice": "0.000991", "currency": "USD", "buyerFields": {"buyerName": "Ali Boos"}, "currentTime": 1490759178479, "invoiceTime": 1490758902121, "expirationTime": 1490759802121, "exceptionStatus": false}
(7 rows)



*/