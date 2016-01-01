
#Blog on [Koa](http://koajs.com/) and [mongoDB](https://www.mongodb.org)

No template engine. Pures javascript with a template string somethin like this:

```javascript
//views/haupt_page.js
let = haupt_page(n)=> `<!DOCTYPE html><html lang="en"><head></head>
<body><b>Some variable: </b>${getVar(n)}</body></html>`;
module.exports={haupt_page};
function getVar(n){
let str='';
if(n.post){
n.post.forEach(el=>{
str+=`<li>${el.title}</li><li>${el.author}</li>`;
});
}
return str;
}
// and then in server.js
var {haupt_page}=require('./haupt_page.js');
router.get('/',function *(){
var db=this.db;
var docs=db.collection('posts');
try{
var post=yield docs.find().toArray();}catch(err){}
this.type="html";
this.body=haupt_page({post});// or this.render('haupt_page',{post})
})
```

### db.collection('posts')

* title:         'How to install Linux'
* sub_title:     'Sub heading - install that thing for 2 minutes'
* slug:          'how-to-install-linux'
* author:        'Bob'
* created_on:     `new Date()`
* slogan:        'hello world'
* description:   'Description of an article for socials network(facebook, twitter)'
* leader:        'Lead Absatz how to bla bla bla'
* body:          'Main content about how to..'
* foto_cover:    'cover_pic_for_this_article.png'
* category:      'web'
* rubrik:        'soft'
* images:        `[{src:'hoarse_pic1x300.png', src1:'hoarse_pic2x600.png',...src[hoarse_2, 3]:'...', title:'Hoarse', content:'About that hoarse',from:'other_site'},{...}]`
* tags:          ['linux','windows'\]
* gesamt_seen:   0
* last_modified: `new Date()` or by update `{$currentDate:{created_on: true}}`
* date_url:      `new Date().getTime().toString().slice(0,8)` //`http://example.com/articles/14507100/how-to-install-linux`
* type:          article
* part:          1
* status:        'active'

#Views

##### haupt_page.js

*head
*warnig/=bool
*header_menu
*admin_main_menu//if admin
*haupt_banner/=bool
*footer

##### articles_page.js

*head
*warnig
*header_menu
*admin_main_menu
*haupt_banner
*articles_block
*paginator
*footer

##### articles_page_page.js

*head
*warnig
*header_menu
*admin_main_menu
*haupt_banner
*articles_block
*paginator
*footer

##### articles_view.js

*head
*header_menu
*admin_main_menu
*footer

##### labs.js

##### login.js

*head
*admin_main_menu

##### admin_dashboard
*admin_main_menu

##### admin_dashboard_articles

*admin_main_menu

$git remote add origin https://github.com/Globik/alikon.git
##
$git push -u origin master
##
From heroku to github.
##
The command goes from my directory on my computer where is the folder with alikon app....

# node-js-getting-started

A barebones Node.js app using [Koa](http://koajs.com/).

This application support the [Getting Started with Node on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article - check it out.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

```sh
$ git clone git@github.com:heroku/node-js-getting-started.git # or clone your own fork
$ cd node-js-getting-started
$ npm install
$ npm start
```

Your app should now be running on [localhost:3000](http://127.0.0.1:3000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
