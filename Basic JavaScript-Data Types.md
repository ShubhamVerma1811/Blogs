# Data Types are important concepts in any language. They define the type of data a variable can hold.

## In JavaScript, we have various data types like:

<!-- TOC -->

- [Number](#number)
- [String](#string)
- [Boolean](#boolean)
- [Arrays](#arrays)
- [Object](#object)
- [null](#null)
- [undefined](#undefined)

<!-- /TOC -->

> ## The `typeof()` function can be used to see the data type of the variable.

---

### Number

This data type can hold integers from -Infinity to +Infinity including
floating-point numbers.

```js
var a = 2;
console.log(typeof a); // "number"
var b = 3.56;
console.log(typeof b); // "number"
```

---

### String

A String is a sequence of characters. String are denoted using `" "` or `' '`

```js
var name = 'Developer';
console.log(typeof name); // string

var letter = 'A';
console.log(typeof letter); // string
```

---

### Boolean

A boolean is a `true` or `false` value.

```js
var isRaining = true;
console.log(typeof raining); // boolean

var isLoggedIn = false;
console.log(typeof isLoggedIn); // boolean
```

---

### Arrays

Arrays are a collection of similar data types. They are denoted using square
brackets `[ ]`

```js
var numbers = [1, 2, 3, 4, 5]; // array of numbers
var colors = ['red', 'green', 'blue']; // array of strings
```

But, in JavaScript, an array can hold various data types too.

```js
var numbersAndColors = [1, 'blue', 2, 'red', 3];
```

You can access the value of the array by its index. Every array has an index
that starts with 0.

```js
console.log(colors[0]); //red
console.log(colors[1]); //green

console.log(numbers[0]); // 1
console.log(numbers[1]); // 2
```

---

### Object

In JavaScript, an object is a collection of key: value pairs. They are denoted
using the `{}` brackets

```js
var obj = {
  name: "Shubham",
  age: 20,
  role: "Frontend Developer",
  isStudent: true,
  hobbies:['coding","reading","eating"]
};
```

Each object's key: value pair must be separated by a comma.

The data of an object can be accessed by the following syntax.

Syntax:

- `ObjectName.keyName` = if the key is a String.
- `ObjectName[keyName]` = if the key is a Number

```js
var obj = {
  name: 'Shubham',
  age: 20,
  role: 'Frontend Developer',
  100: 'Hundred',
};

console.log(obj.name); // "Shubham"
console.log(obj.age); // 20
console.log(obj[100]); // "Hundred"
```

---

### null

A null data type means that value doesn't exist in memory.

---

### undefined

An undefined type means that value exists but is not yet defined.

```js
var a;
console.log(a); // undefined
```

---

These are the basics data types present in JavaScript.

Next, we will learn about JavaScript Operators.
