# Queuem [![npm Package](https://img.shields.io/npm/v/queuem.svg)](https://www.npmjs.org/package/queuem)
Run a sh*tload of tasks in parallel

It is made for cases when you need to run 1,000,000 tasks (parsing files, API requests, etc.) in your app, and not hear from Node.js whining that it cannot do something because of some limitations.

Was originally made for [Page Check](https://www.npmjs.com/package/page-check) module.

### Keep in mind:
 * No need for local storage or database.
 * The queue exists within the current Node.js process. 
 * Based on Node.js `EventEmitter` and has a few [subtleties of use](https://nodejs.org/api/events.html#events_eventemitter_defaultmaxlisteners).



## API
```javascript
let Queue = new Queuem([options])
```


## Properties


### parallel
**Type**: _Number_  
**Default**: `1`   
Get/set the number of concurrent tasks. Takes effect immediately only when the number increases


### emptyDelay
**Type**: _Number_  
**Default**: `0`   
After the queue is empty, the 'empty' event will be called immediately. This option allows to call the 'empty' event with a certain delay


### queue   
**Type**: _Array_  
Tasks list. Decreases as the tasks are completed


### processing   
**Type**: _Number_  
Amount of currently running tasks   



## Methods

### append(task[, data])
**Type**: _Function_    
Adds a new task to the end of the queue


### prepend(task[, data])
**Type**: _Function_    
Adds a new task to the beginning of the queue




## Task

Task function should have two arguments.


### next
**Type**: _Function_    
When you feel like task is done, call `next()` function to pass the slot to the next task in a queue

```javascript
Queue.append((next, data) => {
   // data => { job_id: 549 }
   
   // Tell the task manager that it can take the next task
   next();

}, { job_id: 549 })
```



### data
**Type**: _Any_    
Some data that was passed when the task was created

```javascript
Queue.prepend(fn, { job_id: 549 })
```






## Events

### added
Useless event, but let it be




### done
Triggered each time a task is completed. If you passed something to the `next()` function, it will be available throught handler function argument

```javascript
queue.on('done', (result) => {
   // result => { job_id: 549 }
})
```


### changed
Triggered by any changes

```javascript
queue.on('changed', (e) => {
   // e.action => 'added' or 'done'
})
```


### empty
Fires when queue is empty and there are no running tasks   





## Usage   
```javascript
const Queuem = require('queuem');

let queue = new Queuem({ parallel: 2 });

queue.on('done', (result) => {
   console.log('done:',  result);
})

queue.on('empty', () => {
   console.log('--- COMPLETED ---');
})



for(var i = 0; i < 300; i++){
   queue.append(Task, { job_id: i })
}

// Let's increase the number of parallel tasks
setTimeout(() => queue.parallel = 20, 3000);

function Task(next, data){
   setTimeout(next, Math.random() * 2000, data)
}
```




## Changelog 
#### v3.1.1 (2019-10-01):
- Added `emptyDelay` option

#### v3.1.0 (2019-09-29):
- `data` and `next` arguments have been reversed

#### v3.0.0 (2019-09-22):
- Completely rethought the concept of the module

#### v1.1.1 (2018-02-18):
- changed API, now constructor has only one argument
- added callback function for each finished task
- added `con` setter to changes the amount of concurrent tasks 'on the fly'

