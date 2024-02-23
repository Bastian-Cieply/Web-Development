

console.log('Hello');

fetch("http://localhost:3000/stores")
.then(response => response.json())
.then(stores => {
    stores.forEach(store => {
        Object.values(store).forEach(value => {
            const element = document.createElement('div');
            element.textContent = value;
            document.body.appendChild(element);
        });
    });
});




