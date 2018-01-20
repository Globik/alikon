const is_devel=process.env.DEVELOPMENT;
const devi=()=>is_devel=="yes"?true:false;
module.exports=devi;