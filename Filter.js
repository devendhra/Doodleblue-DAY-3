const employees = [{name: "John", salary: 20000}, {name: "Jane", salary: 22000}, {name: "Jim", salary: 19000}, {name: "Jill", salary: 21000}];

const filteredEmployees = employees.filter(employee => employee.salary >= 20000).map(employee => employee.name).join(", ");

const orderedEmployees = employees.sort((a, b) => b.salary - a.salary).map(employee => employee.name).join(", ");
// console.log(filteredEmployees); 
// console.log(orderedEmployees); 



const restaurant = [{name: "Pasta Place", rating: 4.5}, {name: "Burger Joint", rating: 4.0}, {name: "Sushi Spot", rating: 5.0}, {name: "Taco Town", rating: 3.5}];

const result = restaurant.reduce((acc, curr) => {  
    const averageRating = restaurant.reduce((sum, r) => sum + r.rating, 0) / restaurant.length;
    return averageRating;
}, []);

const result2 = restaurant.find(r => r.rating === 5.0);

console.log(result);
console.log(result2);

const makeGreeter = (greeting) => (name) => {
        return `${greeting}, ${name}!`;
}

const greeting = makeGreeter("Hello")("John");
console.log(greeting); // "Hello, John!"


const result4 = async () => {
    const data = await (await fetch('https://jsonplaceholder.typicode.com/users')).json();
    const result5 = data.filter(user => user.address.city === "South Christy").map(user => user.name).join(", ");
    console.log(result5);
}
console.log(result4());