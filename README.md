# Queuem
Queuefy heavy Node.js tasks


Lightweight and silent module that helps you limit the amount of simultaneous running processes such as PhantomJS, ImageMagick, FFmpeg, etc. Originally made for [Page Check](https://www.npmjs.com/package/page-check) module.



## Usage
```javascript
const Queuem = require('queuem');

function PhantomTask(){
   return Promise.resolve('done: PhantomJs');
}

function ImageMagickTask(){
   return Promise.resolve('done: ImageMagick');
}

function FFmpegTask(){
   return Promise.resolve('done: FFmpeg');
}

let queuem = new Queuem({
   concurrent: 1, 
   taskDone: (data) => {
      console.log(data);
   },
   onComplete: () => {
      console.log('completed!');
   }
})

queuem.add(PhantomTask);
queuem.add(ImageMagickTask);
queuem.add(FFmpegTask);
```



## Queuem({ concurrent, taskDone, onComplete })

### concurrent 
__type__: *Number*<br>
__default__: 1<br>

Maximum number of concurrent tasks<br>


### taskDone 
__type__: *Function*<br>

This callback triggered for each completed task and receives the result/exeption of the promise<br>


### onComplete 
__type__: *Function*<br>

Fires when all tasks are done<br>


### queuem.con = `Number`
__type__: *Setter function*<br>

Changes amount of concurrent tasks


### queuem.add(`task`)
Accepts argument which is a function that returns a Promise


## Changelog 
#### 2018-02-18 (v1.1.1):
- changed API, now constructor has only one argument
- added callback function for each finished task
- added `con` setter to changes the amount of concurrent tasks 'on the fly'

