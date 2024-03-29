var frmState = document.getElementById('yelo-form');
var yeloIconState = document.getElementById('yelo-icon');

function showForm() {
    frmState.style.display = 'block';
    yeloIconState.style.display = 'none';
}

function closeForm() {
    frmState.style.display = 'none';
    yeloIconState.style.display = 'flex';
}

const qty = document.getElementById('qty');
const price = document.getElementById('price');
const result = document.getElementById('total');

qty.addEventListener('input', getTotal);
price.addEventListener('input', getTotal);

function getTotal() {
    const qtyValue = parseFloat(qty.value) || 0;
    const priceValue = parseFloat(price.value) || 0;
    
    const total = qtyValue * priceValue;

    result.value = total;
}

const form = document.querySelector('form');
const save = document.getElementById('save');
const tbody = document.querySelector('table > tbody');
const totalQty = document.getElementById('total-qty');
const totalSummary = document.getElementById('total-summary');


save.addEventListener('click', () => {
    var qtyValue = form[0].value.trim();
    var priceValue = form[1].value.trim();
    var totalValue = form[2].value.trim();

    if (qtyValue === '' || priceValue === '') {
        alert('Please input a valid value');
        return;
    }

    const dbName = "posDB";

    const request = indexedDB.open(dbName, 1);
    
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
    
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains("posData")) {
            const objectStore = db.createObjectStore("posData", { autoIncrement: true });
        }
    };
    
    request.onsuccess = (event) => {
        const db = event.target.result;
    
        // Get the input values
        const qty = document.getElementById('qty').value;
        const price = document.getElementById('price').value;
        const diff = qty * price; // Calculate total
    
        // Start a new transaction
        const transaction = db.transaction(["posData"], "readwrite");
    
        // Access the object store
        const objectStore = transaction.objectStore("posData");
    
        // Add the data to the object store
        const request = objectStore.add({ qty: qty, price: price, total: diff });
    
        request.onsuccess = () => {
            form[0].value = '';
            form[1].value = '';
            form[2].value = '';
            console.log('Data added successfully');
        };
    
        request.onerror = () => {
            console.error('Error adding data');
        };
    };
    readData();
});

function readData() {
    const dbName = "posDB";

    const request = indexedDB.open(dbName, 1);
    
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
    
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains("posData")) {
            const objectStore = db.createObjectStore("posData", { autoIncrement: true });
        }
    };
    
    request.onsuccess = (event) => {
        const db = event.target.result;

        // Start a new transaction
        const transaction = db.transaction(["posData"], "readonly");

        // Access the object store
        const objectStore = transaction.objectStore("posData");

        // Clear table body
        tbody.innerHTML = '';

        // Initialize variables for totals
        let totalQty = 0;
        let totalSummary = 0;

        // Open a cursor to iterate over the object store
        const cursorRequest = objectStore.openCursor();

        cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                // Display data in table row
                tbody.innerHTML += `
                    <tr>
                        <td>${cursor.value.qty}</td>
                        <td>${cursor.value.price}</td>
                        <td>${cursor.value.total}</td>
                    </tr>`;

                // Update totals
                totalQty += parseFloat(cursor.value.qty);
                totalSummary += parseInt(cursor.value.total);

                // Continue to next cursor item
                cursor.continue();
            } else {
                // Display total quantities
                document.getElementById('total-qty').textContent = totalQty;
                document.getElementById('total-summary').textContent = totalSummary;
            }
        };

        cursorRequest.onerror = (event) => {
            console.error('Error reading data:', event.target.error);
        };
    };

    request.onerror = (event) => {
        console.error('Error opening database:', event.target.error);
    };
}

readData()
