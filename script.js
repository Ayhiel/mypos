var frmState = document.getElementById('yelo-form');
var yeloIconState = document.getElementById('yelo-icon');
var feedsState = document.getElementById('feeds-form');
var feedsIconState = document.getElementById('feeds-icon');

function showForm() {
    frmState.style.display = 'block';
    yeloIconState.style.display = 'none';
    feedsIconState.style.display = 'none';
}

function closeForm() {
    frmState.style.display = 'none';
    yeloIconState.style.display = 'flex';
    feedsState.style.display = 'none';
    feedsIconState.style.display = 'flex';
    document.getElementById('qty').value = '';
    document.getElementById('price').value = '5';
    document.getElementById('total').value = '';
    document.getElementById('f-qty').value = '';
    document.getElementById('f-price').value = '45';
    document.getElementById('f-total').value = '';

}

function showFeedsForm() {
    feedsState.style.display = 'block';
    feedsIconState.style.display = 'none';
    yeloIconState.style.display = 'none';
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

const form1 = document.querySelector('.yelo-form');
const save = document.getElementById('save');
const tbody = document.querySelector('table > tbody');
const totalQty = document.getElementById('total-qty');
const totalSummary = document.getElementById('total-summary');


save.addEventListener('click', () => {
    var qtyValue = form1[0].value.trim();
    var priceValue = form1[1].value.trim();
    var totalValue = form1[2].value.trim();

    if (qtyValue === '' || priceValue === '') {
        alert('Please input a valid value');
        return;
    }

    const dbName = "posDBnew";

    const request = indexedDB.open(dbName, 1);
    
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
    
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains("dataPos")) {
            db.createObjectStore("dataPos", { autoIncrement: true });
        }
    };
    
    request.onsuccess = (event) => {
        const db = event.target.result;
    
        // Get the input values
        const qty = document.getElementById('qty').value;
        const price = document.getElementById('price').value;
        const diff = qty * price; // Calculate total
    
        // Start a new transaction
        const transaction = db.transaction(["dataPos"], "readwrite");
    
        // Access the object store
        const objectStore = transaction.objectStore("dataPos");
    
        // Add the data to the object store
        const request = objectStore.add({ qty: qty, price: price, total: diff });
    
        request.onsuccess = () => {
            form1[0].value = '';
            form1[2].value = '';
            console.log('Data added successfully');
        };
    
        request.onerror = () => {
            console.error('Error adding data');
        };
    };
    readData();
});

function readData() {
    const dbName = "posDBnew";

    const request = indexedDB.open(dbName, 1);
    
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
         if (!db.objectStoreNames.contains("dataPos")) {
            db.createObjectStore("dataPos", { autoIncrement: true });
        }
    };
    
    request.onsuccess = (event) => {
        const db = event.target.result;

        // Start a new transaction
        const transaction = db.transaction(["dataPos"], "readonly");

        // Access the object store
        const objectStore = transaction.objectStore("dataPos");

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
                        <td onclick="deleteData(${cursor.key})"><span  class="delete">Delete</span></td>
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

function deleteData(key) {
    const dbName = "posDBnew";

    const request = indexedDB.open(dbName, 1);

    request.onsuccess = (event) => {
        const db = event.target.result;

        // Start a new transaction
        const transaction = db.transaction(["dataPos"], "readwrite");

        // Access the object store
        const objectStore = transaction.objectStore("dataPos");

        // Delete the record with the specified key
        const deleteRequest = objectStore.delete(key);

        deleteRequest.onsuccess = (event) => {
            console.log("Record deleted successfully");
            // You may want to trigger a refresh of the displayed data after deletion
            readData();
        };

        deleteRequest.onerror = (event) => {
            console.error("Error deleting record:", event.target.error);
        };
    };

    request.onerror = (event) => {
        console.error("Error opening database:", event.target.error);
    };
}

//--------- Feeds Script ----------//

const fqty = document.getElementById('f-qty');
const fprice = document.getElementById('f-price');
const fresult = document.getElementById('f-total');

fqty.addEventListener('input', fgetTotal);
fprice.addEventListener('input', fgetTotal);

function fgetTotal() {
    const fqtyValue = parseFloat(fqty.value) || 0;
    const fpriceValue = parseFloat(fprice.value) || 0;
    
    const ftotal = fqtyValue * fpriceValue;

    fresult.value = ftotal;
}

const form2 = document.querySelector('.feeds-form');
const fsave = document.getElementById('f-save');
const ftbody = document.querySelector('.f-tbl-wrapper > table > tbody');
const ftotalQty = document.getElementById('ftotal-qty');
const ftotalSummary = document.getElementById('ftotal-summary');


fsave.addEventListener('click', () => {
    var qtyValue = form2[0].value.trim();
    var priceValue = form2[1].value.trim();
    var totalValue = form2[2].value.trim();

    if (qtyValue === '' || priceValue === '') {
        alert('Please input a valid value');
        return;
    }

    const dbName = "posDB";

    const request = indexedDB.open(dbName, 1);
    
    request.onupgradeneeded = (event) => {
        const fdb = event.target.result;
    
        // Create object store if it doesn't exist
        if (!fdb.objectStoreNames.contains("fdataPos")) {
            fdb.createObjectStore("fdataPos", { autoIncrement: true });
        }
    };
    
    request.onsuccess = (event) => {
        const fdb = event.target.result;
    
        // Get the input values
        const fqty = document.getElementById('f-qty').value;
        const fprice = document.getElementById('f-price').value;
        const fdiff = fqty * fprice; // Calculate total
    
        // Start a new transaction
        const transaction = fdb.transaction(["fdataPos"], "readwrite");
    
        // Access the object store
        const objectStore = transaction.objectStore("fdataPos");
    
        // Add the data to the object store
        const request = objectStore.add({ qty: fqty, price: fprice, total: fdiff });
    
        request.onsuccess = () => {
            form2[0].value = '';
            form2[2].value = '';
            console.log('Data added successfully');
        };
    
        request.onerror = () => {
            console.error('Error adding data');
        };
    };
    freadData();
});

function freadData() {
    const dbName = "posDB";

    const request = indexedDB.open(dbName, 1);
    
    request.onupgradeneeded = (event) => {
        const fdb = event.target.result;
        
        if (!fdb.objectStoreNames.contains("fdataPos")) {
            fdb.createObjectStore("fdataPos", { autoIncrement: true });
        }
    };
    
    request.onsuccess = (event) => {
        const fdb = event.target.result;

        // Start a new transaction
        const transaction = fdb.transaction(["fdataPos"], "readonly");

        // Access the object store
        const objectStore = transaction.objectStore("fdataPos");

        // Clear table body
        ftbody.innerHTML = '';

        // Initialize variables for totals
        let ftotalQty = 0;
        let ftotalSummary = 0;

        // Open a cursor to iterate over the object store
        const cursorRequest = objectStore.openCursor();

        cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                // Display data in table row
                ftbody.innerHTML += `
                    <tr>
                        <td>${cursor.value.qty}</td>
                        <td>${cursor.value.price}</td>
                        <td>${cursor.value.total}</td>
                        <td onclick="fdeleteData(${cursor.key})"><span  class="delete">Delete</span></td>
                    </tr>`;

                // Update totals
                ftotalQty += parseFloat(cursor.value.qty);
                ftotalSummary += parseInt(cursor.value.total);

                // Continue to next cursor item
                cursor.continue();
            } else {
                // Display total quantities
                document.getElementById('f-total-qty').textContent = ftotalQty;
                document.getElementById('f-total-summary').textContent = ftotalSummary;
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

freadData()

function fdeleteData(key) {
    const dbName = "posDB";

    const request = indexedDB.open(dbName, 1);

    request.onsuccess = (event) => {
        const fdb = event.target.result;

        // Start a new transaction
        const transaction = fdb.transaction(["fdataPos"], "readwrite");

        // Access the object store
        const objectStore = transaction.objectStore("fdataPos");

        // Delete the record with the specified key
        const deleteRequest = objectStore.delete(key);

        deleteRequest.onsuccess = (event) => {
            console.log("Record deleted successfully");
            // You may want to trigger a refresh of the displayed data after deletion
            freadData();
        };

        deleteRequest.onerror = (event) => {
            console.error("Error deleting record:", event.target.error);
        };
    };

    request.onerror = (event) => {
        console.error("Error opening database:", event.target.error);
    };
}
