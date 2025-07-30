// Global variables
let orderItems = [];
let orderCounter = 1243;

// DOM elements
const orderForm = document.querySelector('.order-form-container');
const orderTable = document.getElementById('orderTable');
const addQtyBtn = document.getElementById('addQty');
const addToListBtn = document.getElementById('addToList');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeFormValidation();
    updateDateTime();
    calculateTotals();
    setupDropdownNavigation();
    
    // Set default date to today
    document.getElementById('orderDate').value = new Date().toISOString().split('T')[0];
});

// Event listeners
function initializeEventListeners() {
    // Navigation
    setupNavigation();
    
    // Form actions
    addQtyBtn?.addEventListener('click', handleAddQuantity);
    addToListBtn?.addEventListener('click', handleAddToList);
    
    // Table actions
    setupTableActions();
    
    // Form field events
    setupFormFieldEvents();
    
    // Header buttons
    document.querySelector('.btn-save')?.addEventListener('click', handleSave);
    document.querySelector('.btn-previous')?.addEventListener('click', handlePrevious);
    
    // Mobile navigation
    setupMobileNavigation();
}

// Navigation setup
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the navigation text
            // const navText = this.querySelector('span').textContent;
            
            // Update breadcrumb or perform navigation
            updateBreadcrumb(navText);
            
            // Add smooth transition effect
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
}

// Mobile navigation
function setupMobileNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    
    if (!mobileMenuToggle || !sidebar || !mobileOverlay) return;
    
    // Toggle sidebar on mobile menu button click
    mobileMenuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
        mobileOverlay.classList.toggle('show');
        document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
    });
    
    // Close sidebar when clicking overlay
    mobileOverlay.addEventListener('click', function() {
        sidebar.classList.remove('open');
        mobileOverlay.classList.remove('show');
        document.body.style.overflow = '';
    });
    
    // Close sidebar when clicking nav items on mobile
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                mobileOverlay.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('open');
            mobileOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
}

// Form field events
function setupFormFieldEvents() {
    // Price and quantity change events
    const priceField = document.getElementById('price');
    const quantityField = document.getElementById('quantity');
    const totalAmountField = document.getElementById('totalAmount');
    
    function calculateAmount() {
        const price = parseFloat(priceField.value) || 0;
        const quantity = parseFloat(quantityField.value) || 0;
        const total = price * quantity;
        totalAmountField.value = total.toFixed(2);
    }
    
    priceField?.addEventListener('input', calculateAmount);
    quantityField?.addEventListener('input', calculateAmount);
    
    // Form validation on blur
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.addEventListener('blur', function() {
            validateField(this);
        });
        
        control.addEventListener('focus', function() {
            this.classList.remove('error', 'success');
        });
    });
    
    // Auto-format date inputs
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value) {
                this.classList.add('success');
            }
        });
    });
}

// Table actions setup
function setupTableActions() {
    orderTable.addEventListener('click', function(e) {
        if (e.target.closest('.btn-edit')) {
            const row = e.target.closest('tr');
            handleEditRow(row);
        } else if (e.target.closest('.btn-delete')) {
            const row = e.target.closest('tr');
            handleDeleteRow(row);
        }
    });
}

// Handle add quantity
function handleAddQuantity() {
    const quantityField = document.getElementById('quantity');
    const currentQty = parseInt(quantityField.value) || 0;
    const additionalQty = prompt('Enter additional quantity:', '1');
    
    if (additionalQty && !isNaN(additionalQty)) {
        quantityField.value = currentQty + parseInt(additionalQty);
        quantityField.dispatchEvent(new Event('input'));
        
        // Visual feedback
        quantityField.classList.add('success');
        setTimeout(() => quantityField.classList.remove('success'), 2000);
    }
}

// Handle add to list
function handleAddToList() {
    if (!validateForm()) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const formData = getFormData();
    addItemToTable(formData);
    clearForm();
    showNotification('Item added successfully!', 'success');
}

// Get form data
function getFormData() {
    return {
        buyerPO: document.getElementById('buyerPO').value || ++orderCounter,
        date: document.getElementById('orderDate').value || new Date().toISOString().split('T')[0],
        byrArt: document.getElementById('buyerArticle').value || '47',
        ourArtNo: document.getElementById('ourArticle').value || '41717',
        color: document.getElementById('buyerColor').value || '4705',
        unit: '2232', // Default unit
        quantity: document.getElementById('quantity').value,
        price: document.getElementById('price').value,
        amount: document.getElementById('totalAmount').value,
        deliveryDate: document.getElementById('orderDate').value || new Date().toISOString().split('T')[0]
    };
}

// Add item to table
function addItemToTable(data) {
    const tbody = orderTable.querySelector('tbody');
    const row = tbody.insertRow();
    
    row.innerHTML = `
        <td>${data.buyerPO}</td>
        <td>${formatDate(data.date)}</td>
        <td>${data.byrArt}</td>
        <td>${data.ourArtNo}</td>
        <td>${data.color}</td>
        <td>${data.unit}</td>
        <td>${data.quantity}</td>
        <td>${data.price}</td>
        <td>${data.amount}</td>
        <td>${formatDate(data.deliveryDate)}</td>
        <td class="action-cell">
            <button class="btn-edit" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="btn-delete" title="Delete"><i class="fas fa-trash"></i></button>
        </td>
    `;
    
    // Add animation
    row.style.opacity = '0';
    row.style.transform = 'translateY(-10px)';
    setTimeout(() => {
        row.style.opacity = '1';
        row.style.transform = 'translateY(0)';
        row.style.transition = 'all 0.3s ease';
    }, 50);
    
    orderItems.push(data);
    calculateTotals();
}

// Handle edit row
function handleEditRow(row) {
    const cells = row.querySelectorAll('td');
    const rowData = {
        buyerPO: cells[0].textContent,
        date: cells[1].textContent,
        byrArt: cells[2].textContent,
        ourArtNo: cells[3].textContent,
        color: cells[4].textContent,
        unit: cells[5].textContent,
        quantity: cells[6].textContent,
        price: cells[7].textContent,
        amount: cells[8].textContent,
        deliveryDate: cells[9].textContent
    };
    
    // Populate form with row data
    populateFormWithData(rowData);
    
    // Remove row from table
    row.remove();
    
    // Update order items array
    const index = Array.from(row.parentNode.children).indexOf(row);
    orderItems.splice(index, 1);
    
    calculateTotals();
    showNotification('Item loaded for editing', 'info');
}

// Handle delete row
function handleDeleteRow(row) {
    if (confirm('Are you sure you want to delete this item?')) {
        // Add delete animation
        row.style.transition = 'all 0.3s ease';
        row.style.opacity = '0';
        row.style.transform = 'translateX(-100%)';
        
        setTimeout(() => {
            const index = Array.from(row.parentNode.children).indexOf(row);
            orderItems.splice(index, 1);
            row.remove();
            calculateTotals();
            showNotification('Item deleted successfully', 'success');
        }, 300);
    }
}

// Populate form with data
function populateFormWithData(data) {
    document.getElementById('buyerPO').value = data.buyerPO;
    document.getElementById('orderDate').value = convertDateFormat(data.date);
    document.getElementById('quantity').value = data.quantity;
    document.getElementById('price').value = data.price;
    document.getElementById('totalAmount').value = data.amount;
}

// Clear form
function clearForm() {
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        if (control.type !== 'date') {
            control.value = '';
        }
        control.classList.remove('error', 'success');
    });
    
    // Reset total amount
    document.getElementById('totalAmount').value = '';
}

// Form validation
function validateForm() {
    const requiredFields = [
        'quantity',
        'price'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.add('success');
        }
    });
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        field.classList.add('error');
        return false;
    }
    
    if (field.type === 'number' && value && (isNaN(value) || parseFloat(value) < 0)) {
        field.classList.add('error');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        field.classList.add('error');
        return false;
    }
    
    field.classList.remove('error');
    field.classList.add('success');
    return true;
}

// Calculate totals
function calculateTotals() {
    const rows = orderTable.querySelectorAll('tbody tr');
    let totalAmount = 0;
    
    rows.forEach(row => {
        const amount = parseFloat(row.cells[8].textContent) || 0;
        totalAmount += amount;
    });
    
    // Update summary section
    updateSummarySection(totalAmount);
}

// Update summary section
function updateSummarySection(totalAmount) {
    const summaryInputs = document.querySelectorAll('.summary-section input[readonly]');
    const discountValue = calculateDiscount(totalAmount);
    const netAmount = totalAmount - discountValue;
    
    if (summaryInputs.length >= 3) {
        summaryInputs[0].value = discountValue.toFixed(2); // Discount Value
        summaryInputs[1].value = totalAmount.toFixed(2);   // Total Amount
        summaryInputs[2].value = netAmount.toFixed(2);     // Net Amount
    }
}

// Calculate discount
function calculateDiscount(amount) {
    const discountPercentage = parseFloat(document.querySelector('.summary-section input[step]').value) || 0;
    return (amount * discountPercentage) / 100;
}

// Handle save
function handleSave() {
    if (orderItems.length === 0) {
        showNotification('No items to save', 'warning');
        return;
    }
    
    const orderData = {
        items: orderItems,
        summary: getSummaryData(),
        timestamp: new Date().toISOString()
    };
    
    // Simulate save operation
    const saveBtn = document.querySelector('.btn-save');
    const originalText = saveBtn.textContent;
    
    saveBtn.textContent = 'Saving...';
    saveBtn.classList.add('loading');
    
    setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.classList.remove('loading');
        showNotification('Order saved successfully!', 'success');
        
        // Log the data (in real app, this would be sent to server)
        console.log('Order saved:', orderData);
    }, 1500);
}

// Get summary data
function getSummaryData() {
    return {
        totalAmount: document.querySelector('.summary-section input[readonly]').value,
        discount: document.querySelector('.summary-section select').value,
        transportType: document.querySelectorAll('.summary-section select')[1].value
    };
}

// Handle previous
function handlePrevious() {
    if (confirm('Are you sure you want to go back? Unsaved changes will be lost.')) {
        // Simulate navigation
        showNotification('Navigating to previous page...', 'info');
    }
}

// Initialize form validation
function initializeFormValidation() {
    const form = document.querySelector('.order-form-container');
    
    // Add required attributes to essential fields
    const requiredFields = ['quantity', 'price'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.setAttribute('required', 'true');
        }
    });
}

// Update date and time
function updateDateTime() {
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();
    
    // Update any date/time displays
    console.log(`Current date: ${dateStr}, Time: ${timeStr}`);
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
}

function convertDateFormat(dateString) {
    // Convert from DD/MM/YYYY to YYYY-MM-DD
    const parts = dateString.split('/');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return dateString;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function updateBreadcrumb(navText) {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
        breadcrumb.innerHTML = `
            <span>Orders</span>
            <i class="fas fa-chevron-right"></i>
            <span>${navText}</span>
        `;
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        padding: 0.25rem;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#059669',
        error: '#dc2626',
        warning: '#d97706',
        info: '#2563eb'
    };
    return colors[type] || '#2563eb';
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + S to save
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSave();
    }
    
    // Ctrl + N to add new item
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        clearForm();
        document.getElementById('quantity').focus();
    }
    
    // Escape to clear form
    if (e.key === 'Escape') {
        clearForm();
    }
});

// Auto-save functionality (optional)
let autoSaveInterval;
function startAutoSave() {
    autoSaveInterval = setInterval(() => {
        if (orderItems.length > 0) {
            // Auto-save logic here
            console.log('Auto-saving...');
        }
    }, 30000); // Every 30 seconds
}

function stopAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
}

// Start auto-save when page loads
// startAutoSave();

// Cleanup on page unload
window.addEventListener('beforeunload', function(e) {
    stopAutoSave();
    
    if (orderItems.length > 0) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    }
});

// Desktop Dropdown Navigation
function setupDropdownNavigation() {
    const dropdownBtn = document.getElementById('navDropdownBtn');
    const dropdownMenu = document.getElementById('navDropdownMenu');
    const dropdownItems = document.querySelectorAll('.nav-dropdown-item');
    
    if (!dropdownBtn || !dropdownMenu) return;
    
    // Toggle dropdown
    dropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDropdown();
    });
    
    // Handle dropdown item clicks
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            dropdownItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Update dropdown button text
            const selectedText = this.querySelector('span').textContent;
            const btnText = dropdownBtn.querySelector('span');
            if (btnText) {
                btnText.textContent = selectedText;
            }
            
            // Close dropdown
            closeDropdown();
            
            // Handle navigation (you can add specific logic here)
            console.log('Navigated to:', selectedText);
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            closeDropdown();
        }
    });
    
    // Close dropdown on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDropdown();
        }
    });
    
    function toggleDropdown() {
        const isOpen = dropdownMenu.classList.contains('show');
        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    }
    
    function openDropdown() {
        dropdownMenu.classList.add('show');
        dropdownBtn.classList.add('open');
        dropdownBtn.setAttribute('aria-expanded', 'true');
    }
    
    function closeDropdown() {
        dropdownMenu.classList.remove('show');
        dropdownBtn.classList.remove('open');
        dropdownBtn.setAttribute('aria-expanded', 'false');
    }
}
