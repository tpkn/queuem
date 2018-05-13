# Queuem
Queuefy heavy Node.js tasks


Lightweight and silent module that helps you limit the amount of simultaneous running processes such as PhantomJS, ImageMagick, FFmpeg, etc. Originally made for [Page Check](https://www.npmjs.com/package/page-check) module.



## Installation
```bash
npm install queuem
```



## API

### .queue   
Type: _Array_  
Queued tasks list   


### .processing   
Type: _Number_  
Amount of currently running tasks   


### .concurrent
Type: _Number_  
Default: `1`   
Amount of concurrent tasks   


### .add()
Type: _Function_    
Adds new task. Task should return promise


## Events

### task_added

### task_done
Returns task promise result or and error `{ result, err }`  

### complete
Fires when queue is empty and there are no running tasks   




## Usage   
```javascript
const Queuem = require('queuem');

let tasks = new Queuem();

tasks.on('task_done', function(data){
   console.log('task done:', data);
})

tasks.on('complete', function(){
   console.log('complete');
})


for(let i = 0, len = 20; i < len; i++){
   tasks.add(RandomTask);
}

function RandomTask(){
   return new Promise((resolve, reject) => {
      let time = Date.now();
      setTimeout(() => {
         return Math.random() > 0.5 ? resolve({ name: 'RandomTask', time: (Date.now() - time) / 1000 }) : reject('fu!');
      }, Math.random() * 1500);
   })
}
```




## Changelog 
#### v2.0.0 (2018-05-12):
- no more callbacks, just clean and simple events
- setter of concurrent tasks amount renamed from `con` to `concurrent`


#### v1.1.1 (2018-02-18):
- changed API, now constructor has only one argument
- added callback function for each finished task
- added `con` setter to changes the amount of concurrent tasks 'on the fly'

