-- \i /home/globik/alikon/sql/bitaps_pays.sql
drop table bitaps_pays;
create table bitaps_pays(tx_h text not null, -- tx_hash
					   adr text not null, --address
					   inv text not null, --invoice
					   p_c text not null, --code
					   amt bigint not null, --amount (in satoshi)
					   cnf int not null, -- confirmations
					   p_tx_h text not null, -- payout_tx_hash
					   p_m_f float not null, -- payout_miner_fee
					   p_s_f float not null, -- payout_service_fee
					   pus_id varchar(24) not null references busers(id),
					   pat timestamptz not null default now(),
					   pack int not null);