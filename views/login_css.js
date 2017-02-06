var a_color="rgb(25,25,39)";
var strong_color="rgba(0,0,30,0.9);"
var login_css=n=>{
return `
*{box-sizing: border-box;}
html{font-size: 100%;}
body{
	font-size: 1rem;
	font-family: "Helvetica Neue",Helvetica, Arial, sans-serif;
	background: rgb(167,85, 2);
	margin:0;
	padding:0;
	height:100%;
		}
#pagewrap{padding:2rem;}
h2{
	padding-left:6%;
    padding-bottom:10px;
	line-height:2;
	color: rgb(112,66, 20);
		}
h4{
line-height: 1;
font-size:0.9rem;
color: ${strong_color}
}
strong{
font-size:0.9rem;
color: ${strong_color};
font-family: Courier;
}
#red-warnig{background:red;}
.red{background:red;line-height:2;padding:4%;}
.lightgreen{background: lightgreen;}

#mform{
display:block;
width: 100%;
padding-left:6%;
padding-right:6%;

}
#wrap{
background: rgba(237, 201, 175,0.2);
width: 35%;
margin:0 auto;
border: 1px solid transparent;
max-width:31.250em;
		}
.email, .password, .username{
	padding-top:10px;
	padding-bottom:20px;
	position:relative;
   display:block;
		}

.email.red-warning, .password.red-warning{border:1px solid red;}
.sess_orange{background:orange;color:green;}
a{
text-decoration:none;
font-size:0.8rem;
padding-right:1%;
cursor:pointer;
font-weight:normal;
color: ${a_color};
letter-spacing: 0.1vw;
		}
a:hover{color: blue;}
.submit{
	display:block;
	position:relative;
	padding-top:0px;
	padding-bottom:0px;
	width:100%;}
		
input[type=password], input[type=email], input[type=text]{
width:100%;
display:block;
padding-top:10px;
padding-bottom:10px;
margin-top: 4px;
border: 1px solid #ccc;
		}
input[type=submit]{
width: 30%;
display:block;
margin-left:70%;
padding-top:10px;
padding-bottom:10px;
cursor: pointer;	
background: /*rgb(61, 157, 179)*/ brown;
font-family: Courier,sans-serif;
font-weight:bold;
font-size: 0.9rem;
color: ${a_color};
border: 1px solid rgb(28, 108, 122);		
}
#bott, .bott{
display: block; 
width:100%; 
position:relative;
padding-top:10px;
padding-left: 6%;
padding-right:6%;
padding-bottom:20px;
		}

/* social icons */

.soc-desc1{
display:block;
position:absolute;
}
		
.soc-desc{
position:relative;
display:block;
height: auto;
width: 100%;

text-align:center;
}
.soc-desc.fb{background: #4c74c4;background:linear-gradient(to bottom right, #4c74c4, #3b5998);}
.soc-desc.vk{background:#45668e;}
				
.span-social{line-height: 5;}

/* end social icons */

#outresult{
display: none;
background: lightgreen;
width:90%;
margin:1rem auto;
padding:6%;
line-height:2;
/*color:red;*/
}

		
		#loader{
			position: absolute;
			display: none;
			left: 50%;
			top: 50%;
			z-index: 1;
			width: 150px;
			height:150px;
			margin:-75px 0 0 -75px;
			border:16px solid #f3f3f3;
			border-radius:50%;
			border-top:16px solid #3498db;
			animation: spin 2s linear infinite;
		}
		@keyframes spin{
			0% {transform: rotate(0deg);}
			100%{transform: rotate(360deg);}
		}
		.animate-bottom{
			position: relative;
			animation-name: animatebottom;
			animation-duration: 1s;
		}
		@keyframes animatebottom{
			from{bottom:-10rem;opacity:0;}
			to{bottom:0;opacity:1}
		}
		
@media screen and (max-width: 1024px) {
#wrap{width:80%;}
}

@media screen and (max-width: 650px) {
html,body{}
	#wrap, #mform{
	width:100%;
	}
.fb, .vk{width:100%;}

}
@media screen and (max-width: 480px) {
	
	#pagewrap{padding:0.1rem;}
#mform{margin-top:2rem;}
	h1{padding-left:0;}
.nav{margin: 0.5rem;line-height: 2;}
}

`;
}
module.exports={login_css};