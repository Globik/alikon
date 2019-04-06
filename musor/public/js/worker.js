/*mucker1*/ 
self.addEventListener('message',receiveMessage);
function receiveMessage(e){
self.postMessage(e.data);
}