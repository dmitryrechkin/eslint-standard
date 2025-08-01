const items = [1, 2, 3, 4, 5];
const results = [];

// Test 1: forEach with arrow function
items.forEach((item) => {
    results.push(item * 2);
});

// Test 2: forEach with index
items.forEach((item, index) => {
    console.log(`Item at ${index}: ${item}`);
});

// Test 3: Object.entries with forEach
const obj = { a: 1, b: 2, c: 3 };
Object.entries(obj).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
});