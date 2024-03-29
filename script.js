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

    if (qtyValue === '' || priceValue === '') {
        alert('Please input a quantity value');
        return;
    }

    let idb = indexedDB.open('posdb',1)
        idb.onupgradeneeded = () => {
    let res = idb.result;
        res.createObjectStore('data', {autoIncrement: true})
    }
        idb.onsuccess = () => {
    let res = idb.result;
    let tx = res.transaction('data', 'readwrite');
    let store = tx.objectStore('data');
        store.put({
            qty:form[0].value,
            price:form[1].value,
            total:form[2].value
        }
        ).onsuccess = () => {
            form[0].value = '';
            form[1].value = '';
            form[2].value = '';
            };    ;
    };
    readData();
});

function readData() {
    let idb = indexedDB.open('posdb', 1);
    tbody.innerHTML = '';
    let totalQty = 0;
    let totalSummary = 0;
    idb.onsuccess = () => {
        let res = idb.result;
        let tx = res.transaction('data', 'readonly');
        let store = tx.objectStore('data');
        let cursor = store.openCursor();
        cursor.onsuccess = () => {
            let curRes = cursor.result;
            if (curRes) {
                tbody.innerHTML += `
                    <tr>
                        <td>${curRes.value.qty}</td>
                        <td>${curRes.value.price}</td>
                        <td>${curRes.value.total}</td>
                    </tr>`;
                totalQty += parseFloat(curRes.value.qty);
                totalSummary += parseFloat(curRes.value.total);
                curRes.continue();
            } else {
                document.getElementById('total-qty').textContent = totalQty;
                document.getElementById('total-summary').textContent = totalSummary;
            }
        };
    };
}

readData()

