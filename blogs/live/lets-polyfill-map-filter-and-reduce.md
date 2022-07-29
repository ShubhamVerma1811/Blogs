---
id: '23613e06-2bf8-4574-a07e-f15a9c8d67c8'
title: Let's Polyfill - map(), filter() and reduce()
slug: lets-polyfill-map-filter-and-reduce
summary: The hello world of Polyfills
date: 2021-05-17T18:30:00.000Z
coverImage: null
canonicalUrl: null
publicationUrl: null
---

## Map

map is an Array method that takes in a callback and returns an array of items
that were returned from the callback

Example:

```javascript
const arr = [1, 2, 3, 4];
const res = arr.map((el) => el * 2);

console.log(res); // returns [2,4,6,8]
```

Let’s create our own `map` method called `myMap`

- `myMap()` takes in a parameter which a callback/function.
- It has a results array that gets returned by the `myMap` function.
- The returned values from our `cb` are pushed in the `results` array.
- The `this` here would be the array that we will use this `myMap` function on.
- The traditional `map()` callback can take 3 args. element, index and the
  source arr. We have done the same.

```javascript
function myMap(cb) {
  // rseults results array that gets returned at the end
  const results = [];

  for (let i = 0; i < this.length; i++) {
    // returned values of our cb are pushed in the reults[]
    // 'this' referes to the passed array
    results.push(cb(this[i], i, this));
  }

  return results;
}

// Doing this will allow us to use arr.myMap() syntax
Array.prototype.myMap = myMap;

const arr = [1, 2, 3, 4, 5, 6];
const myMapResult = arr.myMap((el, _idx, _arr) => {
  return el * 2;
});

console.log(myMapResult); //[2, 4, 6, 8, 10, 12];
```

---

## Filter

`filter()` is an Array method that takes in a callback and returns an array of
items that satisfy the condition provided in our callback

Example:

```javascript
const arr = [1, 2, 3, 4];
const res = arr.filter((el) => el % 2); // only return even numbers

console.log(res); // [2,4]
```

Let’s create our own `filter` method called `myFilter`

- `myFilter()` takes in a parameter which a callback/function.
- It has a results array that gets returned at the end.
- The returned values from our `cb` are pushed in the `results` array.
- The `this` here would be the array that we will use this `myFilter` function
  on.
- The traditional `filter()` callback can take 3 args. element, index and the
  source arr. We have done the same.

```javascript
function myFilter(cb) {
  const results = [];

  for (let i = 0; i < this.length; i++) {
    const cbResult = cb(this[i], i, this);
    // the returned value of callback is true only then push it to the results
    if (cbResult) results.push(this[i]);
  }

  return results;
}

// Doing this will allow us to use arr.myFilter() syntax
Array.prototype.myFilter = myFilter;

const arr = [1, 2, 3, 4, 5, 6];

const foo = [
  { name: 'S', age: 2 },
  { name: 'V', age: 3 }
];

const myFilterResult = foo.myFilter((el, _idx, _arr) => {
  return el.name !== 'S';
});

console.log(myFilterResult); // [{ name: "V", age: 3 }]
```

---

## Reduce

Here the MDN definition of it.

The `reduce()` method executes a reducer function (that you provide) on each
element of the array, resulting in a single output value.

It takes in two important parameters. `accumulater` and `currentValue`

Example:

```javascript
const arr = [1, 2, 3, 4];
const res = arr.reduce((acc, curr) => {
  acc += curr;
  return acc;
}); // 10

console.log(res); // 10
```

Lets create our own `reduce()` method called `myReduce()`

- `myReduce()` takes in a parameter which a callback/function.
- It returns a single reduced value.
- The returned values from our `cb` is assigned to the `acc`.
- The `this` here would be the array that we will use this `myReduced` function
  on.
- The traditional `reduced()` callback can take 4 args. accumulator,
  currentValue, index and the source arr. We have done the same.

```javascript
function myReduce(cb, initialValue) {
  let acc;
  let curr;

  if (!this.length && !initialValue)
    throw new Error("Can't reduce on empty array, provide initial value");
  else {
    //  If initialValue is given then acc is that or acc = is the 0th index of this
    acc = initialValue ? initialValue : this[0];
    for (let i = 1; i < this.length; i++) {
      // current value of the array
      curr = this[i];
      // the retuned cb value is assigned to acc
      acc = cb(acc, curr, i, this);
    }
  }
  return acc;
}

// Doing this will allow us to use arr.myReduce() syntax
Array.prototype.myReduce = myReduce;

const myReduceResult = arr.myReduce((acc, curr, _idx, _arr) => {
  acc += curr;
  return acc;
});

console.log(myReduceResult); // 21
```

---

If you find any errors or edge cases in the above code then please let me know.
I am happy to learn about them and add them here.

In the next blog in this series, I’ll try and write our own debounce function
from the loadash library

Also, if you guys want to see polyfills of your libs then let me know in the
comments.

Hope this blog was helpful to you.
