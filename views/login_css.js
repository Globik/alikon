var a_color="silver";
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

#mform{
display:block;
width: 100%;
padding-left:6%;
padding-right:6%;

}
#wrap{
background: rgba(237, 201, 175,0.2);
width: 30vw;
margin:0 auto;
border: 1px solid transparent;
		}
.email, .password{
	padding-top:10px;
	padding-bottom:20px;
	position:relative;
   display:block;
		}
a{
text-decoration:none;
font-size:0.9rem;padding-right:1%;
cursor:pointer;
color: ${a_color};
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
#bott{
display: block; 
width:100%; 
position:relative;
padding-top:10px;
padding-left: 3%;
padding-bottom:20px;
		}
ul{
	list-style:none;
	padding:0;
	margin:0;
		}
ul li{
display:inline-block;
width:50%;
padding:30px;
}
.vk{background: #45668e;}
.fb{background: blue;}
/*.fb a, .vk a{background:black;}*/

#outresult{
display:none;
background: lightblue;
width:90%;
margin:1rem auto;
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
		
@media screen and (max-width: 1020px) {

	#wrap{width: 41vw;}

}
@media screen and (max-width: 320px) {
	
	#pagewrap{padding:0.1rem;}
	
	#wrap,#mform{width:100%;}
	#bott{padding-left: 0;}
	h1{padding-left:0;}
}

`;
}
module.exports={login_css};