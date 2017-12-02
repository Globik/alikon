# Simple live video streams project using [Node.js](https://nodejs.org), [Koa](http://koajs.com/), [postgreSQL 9.6](https://www.postgresql.org) and [mediasoup.js v1](https://mediasoup.org)

# Proof Of Concept

**Server-side components**
* [ws.js](https://www.npmjs.com/package/ws): for a chat(chat rooms) and for a [webRTC](https://webrtc.org) signaling protocol layer
* [mediasoup.js v1](https://mediasoup.org): open source WebRTC Powerful SFU model(Selective Forwarding Unit) for multiparty conferencing and similar scenarios (C/C++)
* [postgreSQL 9.6](https://www.postgresql.org): a powerful, open source object-relational database system.
* [koa.js](http://koajs.com) next generation web framework for node.js

**Client-side components**

[Vanilla JS](http://vanilla-js.com) and [vanilla-css](https://www.npmjs.com/package/vanilla-css).

# Features

* One to many videostreaming per chat room.
* One to one videostreaming among chat user and publishers.
* A virtual, in-app currency including tokens, that may be purchased for Bitcoins

Each registered peer can publish his/her own live audio/video feeds: this feed becomes an available stream in the room the other participants
can attach to.

Bitcoin is a very secure and cheap way to accept payments. [bitaps.com](https://bitaps.com/merchant)

# Demo

There is a problem with heroku sandbox. The file system is read only and also the port forwarding is limited to one.
So mediasoup doesn't work in heroku sandbox environment.
But on a local laptop(Linux) it's work like a charm.

[demo](https://alikon.herokuapp.com/webrtc/globik)

# Screenshot

![alt text](http://gifok.net/images/2017/12/01/21078276_1414741411946471_7980266210668162704_n.jpg)

_Inspiring the future_