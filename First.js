// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
    // Load inventory from local storage when the page loads
    loadInventory();

    // Add event listener to the form for adding items
    document.getElementById('item-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission
        addItem();
    });
});

// Function to add an item to the inventory
function addItem() {
    const itemName = document.getElementById('item-name').value;
    const itemQuantity = document.getElementById('item-quantity').value;
    const itemPrice = document.getElementById('item-price').value;

    if (itemName && itemQuantity && itemPrice) {
        // Create an item object
        const item = {
            name: itemName,
            quantity: itemQuantity,
            price: itemPrice
        };

        // Retrieve existing inventory or initialize an empty array
        let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        inventory.push(item); // Add the new item
        localStorage.setItem('inventory', JSON.stringify(inventory)); // Save to local storage

        // Clear the form
        document.getElementById('item-form').reset();

        // Reload the inventory table
        loadInventory();
    } else {
        alert('Please fill out all fields.');
    }
}

// Function to load inventory into the table
function loadInventory() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const table = document.getElementById('inventory-table');

    // Clear existing rows except the header
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    // Add each item to the table
    inventory.forEach((item, index) => {
        const row = table.insertRow(-1); // Insert a new row at the end
        row.insertCell(0).textContent = item.name; // Item Name
        row.insertCell(1).textContent = item.quantity; // Item Quantity
        row.insertCell(2).textContent = item.price; // Item Price

        // Add Edit and Delete buttons
        const actionCell = row.insertCell(3);
        actionCell.innerHTML = `
            <button onclick="editItem(${index})">Edit</button>
            <button onclick="deleteItem(${index})">Delete</button>
        `;
    });
}

// Function to delete an item from the inventory
function deleteItem(index) {
    let inventory = JSON.parse(localStorage.getItem('inventory')); // Get inventory
    inventory.splice(index, 1); // Remove the item at the specified index
    localStorage.setItem('inventory', JSON.stringify(inventory)); // Save updated inventory
    loadInventory(); // Reload the table
}

// Function to edit an item
function editItem(index) {
    let inventory = JSON.parse(localStorage.getItem('inventory')); // Get inventory
    const item = inventory[index]; // Get the item to edit

    // Populate the form with the item's data
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-quantity').value = item.quantity;
    document.getElementById('item-price').value = item.price;

    // Delete the item from the inventory (it will be re-added after editing)
    deleteItem(index);
}

// Handle form submission
document.getElementById('sale-form').addEventListener('submit', function (e) {
    e.preventDefault();
    recordSale();
});

function recordSale() {
    const itemName = document.getElementById('sale-item').value.trim();
    const saleQty = parseInt(document.getElementById('sale-quantity').value);

    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    let item = inventory.find(i => i.name.toLowerCase() === itemName.toLowerCase());

    if (!item) {
        alert('Item not found in inventory.');
        return;
    }

    if (saleQty <= 0 || isNaN(saleQty)) {
        alert('Enter a valid quantity.');
        return;
    }

    if (parseInt(item.quantity) < saleQty) {
        alert(`Not enough stock! Only ${item.quantity} left.`);
        return;
    }

    // Update inventory
    item.quantity = parseInt(item.quantity) - saleQty;
    localStorage.setItem('inventory', JSON.stringify(inventory));
    loadInventory(); // Refresh inventory display

    // Save the sale
    const sales = JSON.parse(localStorage.getItem('sales')) || [];
    const saleEntry = {
        name: itemName,
        quantity: saleQty,
        date: new Date().toLocaleString()
    };
    sales.push(saleEntry);
    localStorage.setItem('sales', JSON.stringify(sales));

    // Reset form and update sales log
    document.getElementById('sale-form').reset();
    loadSales();
}

function loadSales() {
    const sales = JSON.parse(localStorage.getItem('sales')) || [];
    const salesList = document.getElementById('sales-history');
    salesList.innerHTML = '';

    if (sales.length === 0) {
        salesList.innerHTML = '<li>No sales yet.</li>';
    } else {
        sales.reverse().forEach(sale => {
            const li = document.createElement('li');
            li.textContent = `🛒 ${sale.quantity}x ${sale.name} sold on ${sale.date}`;
            salesList.appendChild(li);
        });
    }
}
document.addEventListener('DOMContentLoaded', function () {
    loadInventory();
    loadSales(); // 👉 Add this
    document.getElementById('item-form').addEventListener('submit', function (event) {
        event.preventDefault();
        addItem();
    });
});
