"use strict";
//var pool=require('./app4.js');
const ms = require('ms');
const EventEmitter = require('events');
module.exports = class PgSession extends EventEmitter {

    /**
     * Creates a new PgSession model for use with koa-session-generic
     * @param connection The connection string or object to be passed directly into the pg module
     * @param options A hash consisting of all optional keys {schema="public", table="session", create=true, cleanupTime = 45 minutes}
     * @constructor
     */
    constructor(connection, options) {

        super();

        //If they want to use an existing client they must pass in a function to process each query.
        // Their function must return a promise.
        if (typeof connection === "function"){
            this.query = connection;
console.log('THIS IS AN EXISTING CLIENT');
        //If they don't want to use an existing client, make our own connection to the database and use that for queries
		}else {
			console.log('NOT EXISTING CLIENT');
           // this.db = pgp(connection);
			this.db=connection;
            this.query = (query, params)=> {
                return this.db.query(query, params);
            }
        }

        //By default say that we're not ready to create sessions
        this.ready = false;

        //And store the session options
        this.options = Object.assign({}, PgSession.defaultOpts, options);
		//console.log('this.options: ', this.options);
    }

    static get defaultOpts() {
        return {
            schema: "public",
            table: "session",
            create: true, //Create a new session table by default
            cleanupTime: ms("45 minutes")
        };
    }

    /**
     * Starts the cleanup, and creates the session table if necessary
     * @returns {*} A promise that resolves when the setup has completed
     */
    setup() {

        //Only setup if we're not ready
        if (this.ready)
            return;

        //If we need to create the tables, return a promise that resolves once the query completes
        //Otherwise just setup the cleanup and return an empty promise
        let promise = this.options.create ? this.query(this.createSql) : Promise.resolve();

        //Once we've finished creation, schedule cleanup and tell everyone we're ready
        return promise.then(()=> {
            this.scheduleCleanup();
            this.ready = true;
            this.emit('connect');
        });
    };

    /**
     * Gets a session object with the given sid
     * @param sid The Koa session ID
     * @returns The session object if it exists, otherwise false
     */

    //*get(sid) {
async  get(sid){
 if (!this.ready)
throw new Error(`Error trying to access koa postgres session: session setup has not been run.
            See https://github.com/TMiguelT/koa-pg-session#the-setup-function for details.`);
 const existing = (await this.query(this.getValueSql+`'${sid}'`/*, [sid]*/));

        //If there is no such row, return false
        if (existing.rows.length <= 0){
            return false;
        //Otherwise return the row
		} else{
            return existing.rows[0].session;
		}
    };

    /**
     * Creates a new session or updates an existing one
     * @param sid The Koa session ID to set
     * @param sess The session date to insert into the session table
     * @param ttl The time to live, i.e. the time until the session expires. Defaults to 45 minutes
     */

   // *set(sid, sess, ttl) {
async set(sid,sess,ttl){
        if (!this.ready)
            throw new Error(`Error trying to modify koa postgres session: session setup has not been run.
            See https://github.com/TMiguelT/koa-pg-session#the-setup-function for details.`);

        ttl = ttl || ms("45 minutes");
        const expiry = (Date.now() + ttl) / 1000;

        //If there is a row, update it
        if (await this.get(sid)){
            await this.query(this.updateValueSql, [sess, expiry, sid]);
		}else{
            await this.query(this.insertValueSql, [sid, sess, expiry]);
		}
    };

    /**
     * Destroy the session with the given sid
     * @param sid The Koa session ID of the session to destroy
     */
   // *destroy(sid) {
		async destroy(sid){
        await this.query(this.destroyValueSql, [sid]);
    };

    /**
     * Setup cleanup of all sessions in the session table that have expired
     */
    scheduleCleanup() {
        let sess = this;
//Each interval of cleanupTime, run the cleanup script
        setTimeout(function interval() {
           // sess.query(sess.cleanupSql, Date.now() / 1000).then(()=> {
			sess.query(sess.cleanupSql/*,Date.now()/1000*/,(err,r)=>{
                //Recurse so that the cleanupTime can be dynamic
				//if(err)console.log('err: ',err)
				//console.log('r: ',r);
                setTimeout(interval, sess.options.cleanupTime);
            });
        }, sess.options.cleanupTime);
    };
get createSql() {
return `CREATE SCHEMA IF NOT EXISTS ${this.options.schema};
CREATE TABLE IF NOT EXISTS ${this.options.schema}.${this.options.table}(id TEXT NOT NULL PRIMARY KEY,
expiry timestamp NOT NULL,session JSON)`;
    }
get getValueSql() {
return `select session from ${this.options.schema}.${this.options.table} where id=`;
    }
get updateValueSql() {
return `update ${this.options.schema}.${this.options.table} 
set session=$1, expiry=to_timestamp($2) where id=$3`;
    }
get insertValueSql() {console.log("inserting a session");
return  `INSERT INTO ${this.options.schema}.${this.options.table}(id, session, expiry) 
VALUES($1, $2, to_timestamp($3) )`;
    }
get destroyValueSql() {
return `DELETE from ${this.options.schema}.${this.options.table} WHERE id = $1`;
    }
get cleanupSql() {
return `DELETE FROM ${this.options.schema}.${this.options.table} WHERE expiry <= to_timestamp(${Date.now()/1000})`;
    }
};
