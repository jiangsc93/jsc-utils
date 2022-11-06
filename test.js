const {array, object, type} = require('./index.js');


let arr = [
    {
        name: 'jsc',
        age: 33
    },
    {
        name: 'jsc',
        age: 35
    },
    {
        name: 'jsc',
        age: 226
    },
    {
        name: 'jsc',
        age: 11
    },
    {
        name: 'jsc',
        age: 38
    },
]

// const arr1 = object.objectEach(arr, (item) => {
//     console.log(item, '000')
//     return item.age > 31
// });
let arr2 = [1,2,3,4,5];
const {arrayInsertBefore, arrayRemove} = array;
// arrayInsertBefore(arr2, 1, 3)
const arr3 = arrayRemove(arr, item => item.age === 38)
console.log(arr, '==')
console.log(arr3, '==3')