# Queuem [![npm Package](https://img.shields.io/npm/v/queuem.svg)](https://www.npmjs.org/package/queuem)
The simpliest queue for Node.js you've ever seen


It is made for cases when you need to run 1,000,000 tasks (parsing files, API requests, etc.) in a queue.

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


### pause()
**Type**: _Function_    
Pauses processing the queue. But you can still add tasks in the queue


### resume()
**Type**: _Function_    


### flush()
**Type**: _Function_    
Clears the queue. Already running tasks would not be killed. `empty` event would be called immediately if there are no processing tasks




## Task

Task function should have three arguments


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
Some data that needs to be passed into the task

```javascript
Queue.prepend(fn, { job_id: 549 })
```



### task
**Type**: _Function_    
Task function, just in case you want to run the task one more time






## Events

### added
Useless event, but let it be




### done
Triggered each time a task is completed. If you passed something to the `next()` function, it will be available throught handler function argument

```javascript
Queue.on('done', (result) => {
   // result => { job_id: 549 }
})
```


### changed
Triggered by any changes

```javascript
Queue.on('changed', (e) => {
   // e.action => 'added' or 'done'
})
```


### empty
Fires when queue is empty and there are no running tasks   





## Usage   
```javascript
const Queuem = require('queuem');

let Queue = new Queuem({ parallel: 2, emptyDelay: 5000 });

Queue.on('done', (result) => {
   console.log('done:',  result);
})

Queue.on('empty', () => {
   console.log('--- COMPLETED ---');
})



for(var i = 0; i < 300; i++){
   Queue.append(Task, { job_id: i })
}

function Task(next, data, task){
   if(data.error){
      // Append failed task back to the queue
      data.retries = data.retries + 1 || 1;

      if(data.retries < 10){
         Queue.append(task, data);
      }
   }

   setTimeout(next, Math.random() * 2000, data)
}

// Let's increase the number of parallel tasks
setTimeout(() => Queue.parallel = 50, 3000);
```




## Changelog 
#### v3.2.0 (2019-10-06):
- Added `task` argument

#### v3.1.1 (2019-10-01):
- Added `emptyDelay` option

#### v3.1.0 (2019-09-29):
- `data` and `next` arguments have been reversed

#### v3.0.0 (2019-09-22):
- Completely rethought the concept of the module

#### v1.1.1 (2018-02-18):
- Changed API, now constructor has only one argument
- Added callback function for each finished task
- Added `con` setter to changes the amount of concurrent tasks 'on the fly'

