import { backend } from "declarations/backend";

// Function to show loading spinner
const showLoading = () => {
    document.getElementById('loading').classList.remove('d-none');
};

// Function to hide loading spinner
const hideLoading = () => {
    document.getElementById('loading').classList.add('d-none');
};

// Function to load all taxpayers
async function loadTaxPayers() {
    showLoading();
    try {
        const taxpayers = await backend.getAllTaxPayers();
        const tbody = document.getElementById('taxpayersList');
        tbody.innerHTML = '';
        
        taxpayers.forEach(tp => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${tp.tid}</td>
                <td>${tp.firstName}</td>
                <td>${tp.lastName}</td>
                <td>${tp.address}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading taxpayers:', error);
        alert('Failed to load taxpayers');
    } finally {
        hideLoading();
    }
}

// Add new taxpayer form handler
document.getElementById('addTaxPayerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading();

    const taxpayer = {
        tid: document.getElementById('tid').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        address: document.getElementById('address').value
    };

    try {
        const result = await backend.addTaxPayer(taxpayer);
        if (result) {
            alert('TaxPayer added successfully');
            e.target.reset();
            loadTaxPayers();
        } else {
            alert('TaxPayer with this TID already exists');
        }
    } catch (error) {
        console.error('Error adding taxpayer:', error);
        alert('Failed to add taxpayer');
    } finally {
        hideLoading();
    }
});

// Search form handler
document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading();

    const searchTid = document.getElementById('searchTid').value;
    const resultDiv = document.getElementById('searchResult');

    try {
        const taxpayer = await backend.searchByTID(searchTid);
        if (taxpayer) {
            resultDiv.innerHTML = `
                <div class="alert alert-success">
                    <h5>TaxPayer Found:</h5>
                    <p>Name: ${taxpayer.firstName} ${taxpayer.lastName}</p>
                    <p>TID: ${taxpayer.tid}</p>
                    <p>Address: ${taxpayer.address}</p>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div class="alert alert-warning">
                    No taxpayer found with TID: ${searchTid}
                </div>
            `;
        }
    } catch (error) {
        console.error('Error searching taxpayer:', error);
        resultDiv.innerHTML = `
            <div class="alert alert-danger">
                Error searching for taxpayer
            </div>
        `;
    } finally {
        hideLoading();
    }
});

// Load taxpayers when page loads
window.addEventListener('load', loadTaxPayers);
