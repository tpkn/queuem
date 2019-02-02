# Queuem
Queuefy heavy Node.js tasks


Lightweight and silent module that helps you limit the amount of simultaneous running processes such as PhantomJS, ImageMagick, FFmpeg, etc. Originally made for [Page Check](https://www.npmjs.com/package/page-check) module.



## Installation
```bash
npm install queuem
```



## API

### new Queuem()

### .queue   
**Type**: _Array_  
Queued tasks list   


### .processing   
**Type**: _Number_  
Amount of currently running tasks   


### .concurrent
**Type**: _Number_  
**Default**: `1`   
Amount of concurrent tasks   


### .add([ task, args ])
**Type**: _Function_    
Adds new task. Task should return a promise


## Events

### +1
Useless event, but let it be

### -1
Returns task promise result as object `{ err, result }`

### complete
Fires when queue is empty and there are no running tasks   




## Usage   
```javascript
const Queuem = require('queuem');

let Tasks = new Queuem()
.on('+1', () => {
   console.log('+1');
})
.on('-1', (results) => {
   if(results.err){
      return console.log('-1', '=>', results.err);
   }

   console.log('-1', '=>', results.data.some_data);
})
.on('complete', () => {
   console.log('complete');
})


for(let i = 0, len = 20; i < len; i++){
   Tasks.add(RandomTask, { uid: Math.random().toString(16) });
}

function RandomTask(data){
   return new Promise((resolve, reject) => {
      let time = Date.now();
      setTimeout(() => {
         return Math.random() > 0.5 ? resolve({ some_data: data.uid }) : reject('nope');
      }, Math.random() * 1500);
   })
}
```




## Changelog 
#### v2.2.0 (2019-02-03):
- events name become shorter (`task_done` => `-1`)

#### v2.1.0 (2018-09-09):
- additional data could be to passed to queued task


#### v2.0.0 (2018-05-12):
- no more callbacks, just clean and simple events
- setter of concurrent tasks amount renamed from `con` to `concurrent`


#### v1.1.1 (2018-02-18):
- changed API, now constructor has only one argument
- added callback function for each finished task
- added `con` setter to changes the amount of concurrent tasks 'on the fly'

