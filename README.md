# Queuem

Queuefy heavy Node.js tasks


Lightweight and silent module that helps you limit amount of simultaneous running processes such as PhantomJS, ImageMagick, etc. Originally made for [Page Check](https://www.npmjs.com/package/page-check) module.



## Usage
```javascript
const Queuem = require('queuem');

function PhantomTask1(){
   return new Promise((resolve, reject) => {
      resolve();
   });
}

function PhantomTask2(){
   return new Promise((resolve, reject) => {
      resolve();
   });
}

let tasks = new Queuem(4, () => {
   console.log('completed!');
});

tasks.add(PhantomTask1);
tasks.add(PhantomTask2);
```



## Arguments

### max_concurrent 
__type__: *Number*<br>
__default__: 3<br>

Maximum number of concurrent tasks.<br>
Could be skipped.


### on_complete 
__type__: *Function*<br>

Fires when all tasks are done.<br>
Could be skipped.



## Method

### add(`task`)
Argument is a function that returns Promise.


