// Real-time clock functionality
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.querySelector('.time').textContent = timeString;
}

// Update clock every second
setInterval(updateClock, 1000);
updateClock(); // Initial call

// CBM Calculation functionality
function calculateCBM() {
    // Get dimension inputs more specifically
    const dimensionGrid = document.querySelector('.dimension-grid');
    if (!dimensionGrid) return;
    
    const lengthInput = dimensionGrid.querySelector('input[type="number"][required]');
    const widthInput = dimensionGrid.querySelectorAll('input[type="number"][required]')[1];
    const heightInput = dimensionGrid.querySelectorAll('input[type="number"][required]')[2];
    const cbmOutput = dimensionGrid.querySelector('input[readonly]');
    const sizeUnitSelect = dimensionGrid.querySelector('select');
    
    if (!lengthInput || !widthInput || !heightInput || !cbmOutput) return;
    
    const length = parseFloat(lengthInput.value) || 0;
    const width = parseFloat(widthInput.value) || 0;
    const height = parseFloat(heightInput.value) || 0;
    const sizeUnit = sizeUnitSelect ? sizeUnitSelect.value : 'inch';
    
    // Only calculate if all three dimensions are provided
    if (length > 0 && width > 0 && height > 0) {
        let cbm = 0;
        
        // Convert to CBM based on unit
        switch(sizeUnit) {
            case 'inch':
                // Convert cubic inches to cubic meters (1 cubic inch = 0.000016387 cubic meters)
                cbm = (length * width * height) * 0.000016387064;
                break;
            case 'cm':
                // Convert cubic centimeters to cubic meters (1 cubic cm = 0.000001 cubic meters)
                cbm = (length * width * height) * 0.000001;
                break;
            case 'mm':
                // Convert cubic millimeters to cubic meters (1 cubic mm = 0.000000001 cubic meters)
                cbm = (length * width * height) * 0.000000001;
                break;
            case 'feet':
                // Convert cubic feet to cubic meters (1 cubic foot = 0.0283168 cubic meters)
                cbm = (length * width * height) * 0.0283168466;
                break;
            default:
                // Default to inches
                cbm = (length * width * height) * 0.000016387064;
        }
        
        cbmOutput.value = cbm.toFixed(6);
        
        // Add visual feedback with a subtle animation
        cbmOutput.style.backgroundColor = '#e8f5e8';
        cbmOutput.style.transition = 'background-color 0.3s ease';
        setTimeout(() => {
            cbmOutput.style.backgroundColor = '';
        }, 1500);
        
        // Optional: Show unit info in console for debugging
        console.log(`CBM calculated: ${cbm.toFixed(6)} m³ (${length}×${width}×${height} ${sizeUnit})`);
        
        // Auto-calculate container loadability
        calculateContainerLoadability(cbm);
    } else {
        cbmOutput.value = '';
        // Clear container calculations when dimensions are incomplete
        clearContainerCalculations();
    }
}

// Container Loadability Calculation functionality
function calculateContainerLoadability(productCBM) {
    const containerSection = document.querySelector('.container-inputs');
    if (!containerSection) return;
    
    const totalCftInput = containerSection.querySelector('input[type="text"]');
    const container1Input = containerSection.querySelectorAll('.container-row input')[0];
    const container2Input = containerSection.querySelectorAll('.container-row input')[1];
    const container3Input = containerSection.querySelectorAll('.container-row input')[2];
    
    if (!totalCftInput || !container1Input || !container2Input || !container3Input) return;
    
    // Convert CBM to CFT (1 CBM = 35.3147 CFT)
    const productCFT = productCBM * 35.3147;
    
    // Standard container capacities in CBM
    const containers = {
        '20ft': { cbm: 33, cft: 1165, name: '20ft Container' },
        '40ft': { cbm: 67, cft: 2366, name: '40ft Container' },
        '40hc': { cbm: 76, cft: 2683, name: '40ft HC Container' }
    };
    
    // Update Total CFT
    totalCftInput.value = productCFT.toFixed(2);
    
    // Calculate how many products fit in each container type
    const container20ftQty = Math.floor(containers['20ft'].cbm / productCBM);
    const container40ftQty = Math.floor(containers['40ft'].cbm / productCBM);
    const container40hcQty = Math.floor(containers['40hc'].cbm / productCBM);
    
    // Update container inputs with calculated quantities
    if (container20ftQty > 0) {
        container1Input.value = `${container20ftQty} pcs (20ft)`;
        container1Input.placeholder = `${containers['20ft'].name}`;
    } else {
        container1Input.value = 'Too large for 20ft';
    }
    
    if (container40ftQty > 0) {
        container2Input.value = `${container40ftQty} pcs (40ft)`;
        container2Input.placeholder = `${containers['40ft'].name}`;
    } else {
        container2Input.value = 'Too large for 40ft';
    }
    
    if (container40hcQty > 0) {
        container3Input.value = `${container40hcQty} pcs (40ft HC)`;
        container3Input.placeholder = `${containers['40hc'].name}`;
    } else {
        container3Input.value = 'Too large for 40ft HC';
    }
    
    // Add visual feedback to container inputs
    [totalCftInput, container1Input, container2Input, container3Input].forEach(input => {
        input.style.backgroundColor = '#e8f5e8';
        input.style.transition = 'background-color 0.3s ease';
        setTimeout(() => {
            input.style.backgroundColor = '';
        }, 2000);
    });
    
    console.log(`Container loadability calculated:
        Product CBM: ${productCBM.toFixed(6)} m³
        Product CFT: ${productCFT.toFixed(2)} ft³
        20ft Container: ${container20ftQty} pieces
        40ft Container: ${container40ftQty} pieces
        40ft HC Container: ${container40hcQty} pieces`);
}

// Clear container calculations
function clearContainerCalculations() {
    const containerSection = document.querySelector('.container-inputs');
    if (!containerSection) return;
    
    const totalCftInput = containerSection.querySelector('input[type="text"]');
    const containerInputs = containerSection.querySelectorAll('.container-row input');
    
    if (totalCftInput) {
        totalCftInput.value = '';
    }
    
    containerInputs.forEach((input, index) => {
        input.value = '';
        // input.placeholder = `Container ${index + 1}`;
    });
}

// Add event listeners for dimension inputs
document.addEventListener('DOMContentLoaded', function() {
    const dimensionGrid = document.querySelector('.dimension-grid');
    if (dimensionGrid) {
        // Get dimension inputs and unit selector
        const dimensionInputs = dimensionGrid.querySelectorAll('input[type="number"][required]');
        const sizeUnitSelect = dimensionGrid.querySelector('select');
        
        // Add event listeners to dimension inputs
        dimensionInputs.forEach(input => {
            input.addEventListener('input', calculateCBM);
            input.addEventListener('blur', calculateCBM);
        });
        
        // Add event listener to size unit dropdown
        if (sizeUnitSelect) {
            sizeUnitSelect.addEventListener('change', calculateCBM);
        }
        
        // Initial calculation if values are present
        setTimeout(calculateCBM, 100);
    }

    // CM. WGT. button functionality
    const cmWgtBtn = document.querySelector('.cm-wgt-btn');
    if (cmWgtBtn) {
        cmWgtBtn.addEventListener('click', function() {
            // Calculate weight based on dimensions
            const dimensionGrid = document.querySelector('.dimension-grid');
            if (!dimensionGrid) return;
            
            const lengthInput = dimensionGrid.querySelector('input[type="number"][required]');
            const widthInput = dimensionGrid.querySelectorAll('input[type="number"][required]')[1];
            const heightInput = dimensionGrid.querySelectorAll('input[type="number"][required]')[2];
            const sizeUnitSelect = dimensionGrid.querySelector('select');
            const netWtInput = dimensionGrid.querySelector('input[type="number"]:not([required])');
            
            if (!lengthInput || !widthInput || !heightInput || !netWtInput) return;
            
            const length = parseFloat(lengthInput.value) || 0;
            const width = parseFloat(widthInput.value) || 0;
            const height = parseFloat(heightInput.value) || 0;
            const sizeUnit = sizeUnitSelect ? sizeUnitSelect.value : 'inch';
            
            if (length > 0 && width > 0 && height > 0) {
                let volumeInCubicMeters = 0;
                
                // Convert to cubic meters based on unit
                switch(sizeUnit) {
                    case 'inch':
                        volumeInCubicMeters = (length * width * height) * 0.000016387064;
                        break;
                    case 'cm':
                        volumeInCubicMeters = (length * width * height) * 0.000001;
                        break;
                    case 'mm':
                        volumeInCubicMeters = (length * width * height) * 0.000000001;
                        break;
                    case 'feet':
                        volumeInCubicMeters = (length * width * height) * 0.0283168466;
                        break;
                    default:
                        volumeInCubicMeters = (length * width * height) * 0.000016387064;
                }
                
                // Estimate weight based on material density (assuming wood/furniture - 600 kg/m³)
                const estimatedWeight = volumeInCubicMeters * 600;
                
                netWtInput.value = estimatedWeight.toFixed(2);
                
                // Add visual feedback
                netWtInput.style.backgroundColor = '#e8f5e8';
                setTimeout(() => {
                    netWtInput.style.backgroundColor = '';
                }, 1000);
                
                alert(`Estimated weight calculated: ${estimatedWeight.toFixed(2)} kg\nBased on volume: ${volumeInCubicMeters.toFixed(6)} m³`);
            } else {
                alert('Please enter all dimension values (Length, Width, Height) to calculate weight.');
            }
        });
    }

    // Add button functionality
    const addButtons = document.querySelectorAll('.add-btn');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const inputWithBtn = this.parentElement;
            const searchableContainer = inputWithBtn.querySelector('.searchable-dropdown-container');
            const regularInput = inputWithBtn.querySelector('input:not(.searchable-dropdown-input)');
            const regularSelect = inputWithBtn.querySelector('select');
            
            const label = inputWithBtn.previousElementSibling.textContent.replace(' *', '');
            
            // Show a simple prompt for adding new items
            const newValue = prompt(`Enter new ${label}:`);
            if (newValue && newValue.trim()) {
                if (searchableContainer) {
                    // Add to searchable dropdown
                    const dropdown = searchableContainer.querySelector('.searchable-dropdown-list');
                    const newItem = document.createElement('div');
                    newItem.className = 'searchable-dropdown-item';
                    newItem.setAttribute('data-value', newValue.toLowerCase().replace(/\s+/g, '-'));
                    newItem.textContent = newValue.toUpperCase();
                    
                    // Add click handler to new item
                    newItem.addEventListener('click', function(e) {
                        e.stopPropagation();
                        
                        // Remove selected class from all items
                        dropdown.querySelectorAll('.searchable-dropdown-item').forEach(i => i.classList.remove('selected'));
                        
                        // Add selected class to clicked item
                        this.classList.add('selected');
                        
                        // Update input value
                        const input = searchableContainer.querySelector('.searchable-dropdown-input');
                        input.value = this.textContent;
                        
                        // Close dropdown
                        dropdown.classList.remove('show');
                        const arrow = searchableContainer.querySelector('.searchable-dropdown-arrow');
                        arrow.style.transform = 'translateY(-50%) rotate(0deg)';
                        
                        // Update container methods
                        searchableContainer.getValue = () => this.getAttribute('data-value');
                        searchableContainer.getText = () => this.textContent;
                    });
                    
                    dropdown.appendChild(newItem);
                    
                    // Select the new item
                    newItem.click();
                    
                } else if (regularSelect) {
                    // Handle regular select
                    const option = document.createElement('option');
                    option.value = newValue.toLowerCase().replace(/\s+/g, '-');
                    option.textContent = newValue;
                    regularSelect.appendChild(option);
                    regularSelect.value = option.value;
                } else if (regularInput) {
                    // Handle regular input
                    regularInput.value = newValue;
                }
            }
        });
    });

    // Search button functionality
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            // alert('Search functionality would be implemented here. This could search through existing products.');
        });
    }

    // Upload Image functionality
    const uploadBtn = document.querySelector('.upload-btn');
    const imageContainer = document.querySelector('.image-container');
    
    if (uploadBtn && imageContainer) {
        uploadBtn.addEventListener('click', function() {
            // Create a file input element
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.maxWidth = '100%';
                        img.style.maxHeight = '100%';
                        img.style.objectFit = 'contain';
                        
                        // Clear the no-image content
                        imageContainer.innerHTML = '';
                        imageContainer.appendChild(img);
                        
                        // Add paperclip icon back
                        const paperclip = document.createElement('i');
                        paperclip.className = 'fas fa-paperclip paperclip-icon';
                        imageContainer.appendChild(paperclip);
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            fileInput.click();
        });
    }

    // Set Details button functionality
    const setDetailsBtn = document.querySelector('.set-details-btn');
    if (setDetailsBtn) {
        setDetailsBtn.addEventListener('click', function() {
            // Validate required fields including searchable dropdowns
            const requiredFields = document.querySelectorAll('[required]');
            const requiredDropdowns = document.querySelectorAll('[data-required="true"]');
            let isValid = true;
            let missingFields = [];
            
            // Check regular required fields
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    const label = field.previousElementSibling?.textContent || field.parentElement.previousElementSibling?.textContent;
                    if (label) {
                        missingFields.push(label.replace(' *', ''));
                    }
                }
            });
            
            // Check required searchable dropdowns
            requiredDropdowns.forEach(dropdown => {
                if (!dropdown.getValue || !dropdown.getValue()) {
                    isValid = false;
                    const label = dropdown.parentElement.previousElementSibling?.textContent;
                    if (label) {
                        missingFields.push(label.replace(' *', ''));
                    }
                    // Add visual feedback
                    const input = dropdown.querySelector('.searchable-dropdown-input');
                    if (input) {
                        input.style.borderColor = '#ff4444';
                    }
                }
            });
            
            if (!isValid) {
                alert('Please fill in all required fields:\n' + missingFields.join('\n'));
                return;
            }
            
            // Auto-fill some fields based on product name
            const productName = document.querySelector('input[type="text"][required]').value;
            if (productName) {
                // Generate a simple alias code
                const aliasCode = productName.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 1000);
                const aliasInput = document.querySelector('input[value="ABC-2025-001"]');
                if (aliasInput) {
                    aliasInput.value = aliasCode;
                }
                
                alert('Details have been set successfully!');
            }
        });
    }

    // Save button functionality
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            // Validate required fields including searchable dropdowns
            const requiredFields = document.querySelectorAll('[required]');
            const requiredDropdowns = document.querySelectorAll('[data-required="true"]');
            let isValid = true;
            let missingFields = [];
            
            // Check regular required fields
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    const label = field.previousElementSibling?.textContent || field.parentElement.previousElementSibling?.textContent;
                    if (label) {
                        missingFields.push(label.replace(' *', ''));
                    }
                }
            });
            
            // Check required searchable dropdowns
            requiredDropdowns.forEach(dropdown => {
                if (!dropdown.getValue || !dropdown.getValue()) {
                    isValid = false;
                    const label = dropdown.parentElement.previousElementSibling?.textContent;
                    if (label) {
                        missingFields.push(label.replace(' *', ''));
                    }
                    // Add visual feedback
                    const input = dropdown.querySelector('.searchable-dropdown-input');
                    if (input) {
                        input.style.borderColor = '#ff4444';
                    }
                }
            });
            
            if (!isValid) {
                alert('Please fill in all required fields:\n' + missingFields.join('\n'));
                return;
            }
            
            // Collect form data including searchable dropdowns
            const formData = {};
            document.querySelectorAll('input, select, textarea').forEach(field => {
                if (field.name || field.id) {
                    formData[field.name || field.id] = field.value;
                }
            });
            
            // Add searchable dropdown values
            document.querySelectorAll('.searchable-dropdown-container').forEach(container => {
                const label = container.parentElement.previousElementSibling?.textContent?.replace(' *', '');
                if (label && container.getValue) {
                    formData[label.toLowerCase().replace(/\s+/g, '_')] = {
                        value: container.getValue(),
                        text: container.getText()
                    };
                }
            });
            
            // Simulate saving to server
            console.log('Saving data:', formData);
            alert('Product saved successfully!');
        });
    }

    // Add Box button functionality
    // const addBoxBtn = document.querySelector('.add-box-btn');
    if (addBoxBtn) {
        addBoxBtn.addEventListener('click', function() {
            // Create a new box entry
            const dimensionGrid = document.querySelector('.dimension-grid');
            const newBox = document.createElement('div');
            newBox.className = 'form-group';
            newBox.innerHTML = `
                <label>Box ${document.querySelectorAll('.dimension-grid .form-group').length + 1}</label>
                <input type="text" placeholder="Box details">
            `;
            dimensionGrid.appendChild(newBox);
        });
    }

    // Menu button functionality
    const menuBtn = document.querySelector('.menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            alert('Menu functionality would be implemented here. This could show navigation options.');
        });
    }

    // Header icons functionality
    const headerIcons = document.querySelectorAll('.header-icons i');
    headerIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const iconClass = this.className;
            if (iconClass.includes('fa-comments')) {
                alert('Chat functionality would be implemented here.');
            } else if (iconClass.includes('fa-bell')) {
                alert('Notifications would be shown here.');
            } else if (iconClass.includes('fa-user')) {
                alert('User profile would be shown here.');
            }
        });
    });

    // Form validation and real-time feedback
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#ff4444';
            } else {
                this.style.borderColor = '#ddd';
            }
        });
        
        field.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(255, 68, 68)') {
                this.style.borderColor = '#ddd';
            }
        });
    });

    // Auto-calculate total CFT
    const totalCftInput = document.querySelector('.container-inputs input[type="text"]');
    if (totalCftInput) {
        totalCftInput.addEventListener('input', function() {
            const containerInputs = document.querySelectorAll('.container-row input');
            let total = 0;
            
            containerInputs.forEach(input => {
                const value = parseFloat(input.value) || 0;
                total += value;
            });
            
            if (total > 0) {
                this.value = total.toFixed(2);
            }
        });
    }

    // Container input functionality
    document.querySelectorAll('.container-row input').forEach(input => {
        input.addEventListener('input', function() {
            const containerInputs = document.querySelectorAll('.container-row input');
            let total = 0;
            
            containerInputs.forEach(containerInput => {
                const value = parseFloat(containerInput.value) || 0;
                total += value;
            });
            
            const totalCftInput = document.querySelector('.container-inputs input[type="text"]');
            if (totalCftInput && total > 0) {
                totalCftInput.value = total.toFixed(2);
            }
        });
    });
});

// Utility function to format numbers
function formatNumber(num) {
    return parseFloat(num).toFixed(2);
}

// Utility function to validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Export functions for potential external use
window.ERPUtils = {
    calculateCBM,
    calculateContainerLoadability,
    clearContainerCalculations,
    formatNumber,
    validateEmail,
    updateClock
};

// Test function to verify all functionality
function testAllFunctionality() {
    console.log('Testing ERP System Functionality...');
    
    // Test clock
    console.log('✓ Clock is running:', document.querySelector('.time').textContent);
    
    // Test form validation
    const requiredFields = document.querySelectorAll('[required]');
    console.log('✓ Required fields found:', requiredFields.length);
    
    // Test buttons
    const buttons = document.querySelectorAll('button');
    console.log('✓ Buttons found:', buttons.length);
    
    // Test image upload
    const uploadBtn = document.querySelector('.upload-btn');
    console.log('✓ Upload button found:', !!uploadBtn);
    
    // Test CBM calculation
    const dimensionInputs = document.querySelectorAll('input[type="number"][required]');
    console.log('✓ Dimension inputs found:', dimensionInputs.length);
    
    console.log('✓ All functionality tests completed!');
}

// Run test when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(testAllFunctionality, 1000);
    
    // Initialize multi-select dropdowns
    initializeMultiSelectDropdowns();
    
    // Initialize searchable dropdowns
    initializeSearchableDropdowns();
    
    // Initialize BOM Type conditional fields
    initializeBomTypeConditionalFields();
    
    // Initialize Set Status conditional fields
    initializeSetStatusConditionalFields();
    
    // Initialize Other Detail conditional fields
    initializeOtherDetailConditionalFields();
    
    // Initialize Product Search Modal
    initializeProductSearchModal();
    
    // Initialize Chief Materials Modal
    initializeChiefMaterialsModal();
    
    // Initialize Shelve conditional field
    initializeShelveConditionalField();
    
    // Initialize Mattress conditional field
    initializeMattressConditionalField();
    
    // Initialize Vriksha Req conditional field
    initializeVrikshaReqConditionalField();
    
    // Initialize Box Gross Weight automatic calculation
    initializeBoxGrossWeightCalculation();
    
    // Initialize Box Details functionality
    initializeBoxDetailsSection();
    
    // Initialize Upload Modal
    initializeUploadModal();
});

// Multi-Select Dropdown Functionality
function initializeMultiSelectDropdowns() {
    const multiSelectContainers = document.querySelectorAll('.multi-select-container');
    
    multiSelectContainers.forEach(container => {
        const input = container.querySelector('.multi-select-input-field');
        const dropdown = container.querySelector('.multi-select-dropdown');
        const options = container.querySelectorAll('.option');
        const selectedTags = container.querySelector('.selected-tags');
        const searchInput = container.querySelector('.search-input');
        
        // Show dropdown on input focus
        input.addEventListener('focus', () => {
            dropdown.style.display = 'block';
        });
        
        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
        
        // Handle option selection
        options.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.getAttribute('data-value');
                const text = option.textContent;
                
                // Check if already selected
                const existingTag = selectedTags.querySelector(`[data-value="${value}"]`);
                if (!existingTag) {
                    // Add new tag
                    const tag = document.createElement('span');
                    tag.className = 'tag';
                    tag.setAttribute('data-value', value);
                    tag.innerHTML = `${text} <i class="fas fa-times remove-tag"></i>`;
                    
                    // Add remove functionality
                    tag.querySelector('.remove-tag').addEventListener('click', () => {
                        tag.remove();
                    });
                    
                    selectedTags.appendChild(tag);
                }
                
                input.value = '';
                dropdown.style.display = 'none';
            });
        });
        
        // Handle search functionality
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                
                options.forEach(option => {
                    const text = option.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        option.classList.remove('hidden');
                    } else {
                        option.classList.add('hidden');
                    }
                });
            });
        }
        
        // Handle tag removal
        selectedTags.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-tag')) {
                e.target.parentElement.remove();
            }
        });
    });
}

// Searchable Dropdown Functionality
function initializeSearchableDropdowns() {
    const dropdownContainers = document.querySelectorAll('.searchable-dropdown-container');
    
    dropdownContainers.forEach(container => {
        const input = container.querySelector('.searchable-dropdown-input');
        const dropdown = container.querySelector('.searchable-dropdown-list');
        const items = container.querySelectorAll('.searchable-dropdown-item');
        const arrow = container.querySelector('.searchable-dropdown-arrow');
        
        let selectedValue = '';
        let selectedText = '';
        
        // Toggle dropdown on input click
        input.addEventListener('click', function(e) {
            e.stopPropagation();
            closeAllDropdowns();
            dropdown.classList.add('show');
            input.removeAttribute('readonly');
            input.focus();
            arrow.style.transform = 'translateY(-50%) rotate(180deg)';
        });
        
        // Handle input typing for search
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            let hasVisibleItems = false;
            
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.classList.remove('hidden');
                    hasVisibleItems = true;
                } else {
                    item.classList.add('hidden');
                }
            });
            
            // Show "No results" message if no items match
            let noResultsDiv = dropdown.querySelector('.searchable-dropdown-no-results');
            if (!hasVisibleItems && searchTerm.length > 0) {
                if (!noResultsDiv) {
                    noResultsDiv = document.createElement('div');
                    noResultsDiv.className = 'searchable-dropdown-no-results';
                    noResultsDiv.textContent = 'No results found';
                    dropdown.appendChild(noResultsDiv);
                }
                noResultsDiv.style.display = 'block';
            } else if (noResultsDiv) {
                noResultsDiv.style.display = 'none';
            }
        });
        
        // Handle item selection
        items.forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Remove selected class from all items
                items.forEach(i => i.classList.remove('selected'));
                
                // Add selected class to clicked item
                this.classList.add('selected');
                
                // Update input value and store selection
                selectedValue = this.getAttribute('data-value');
                selectedText = this.textContent;
                input.value = selectedText;
                input.setAttribute('readonly', 'readonly');
                
                // Remove error styling if present
                input.classList.remove('error');
                input.style.borderColor = '#ddd';
                
                // Close dropdown
                dropdown.classList.remove('show');
                arrow.style.transform = 'translateY(-50%) rotate(0deg)';
                
                // Trigger change event for validation
                input.dispatchEvent(new Event('change', { bubbles: true }));
            });
            
            // Highlight on hover
            item.addEventListener('mouseenter', function() {
                items.forEach(i => i.style.backgroundColor = '');
                this.style.backgroundColor = '#8e44ad';
                this.style.color = 'white';
            });
            
            item.addEventListener('mouseleave', function() {
                if (!this.classList.contains('selected')) {
                    this.style.backgroundColor = '';
                    this.style.color = '#333';
                }
            });
        });
        
        // Handle keyboard navigation
        input.addEventListener('keydown', function(e) {
            const visibleItems = Array.from(items).filter(item => !item.classList.contains('hidden'));
            const currentHighlighted = dropdown.querySelector('.searchable-dropdown-item[style*="background-color: rgb(142, 68, 173)"]');
            let currentIndex = currentHighlighted ? visibleItems.indexOf(currentHighlighted) : -1;
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (!dropdown.classList.contains('show')) {
                        dropdown.classList.add('show');
                        arrow.style.transform = 'translateY(-50%) rotate(180deg)';
                    } else {
                        currentIndex = Math.min(currentIndex + 1, visibleItems.length - 1);
                        highlightItem(visibleItems, currentIndex);
                    }
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    if (dropdown.classList.contains('show')) {
                        currentIndex = Math.max(currentIndex - 1, 0);
                        highlightItem(visibleItems, currentIndex);
                    }
                    break;
                    
                case 'Enter':
                    e.preventDefault();
                    if (currentHighlighted) {
                        currentHighlighted.click();
                    }
                    break;
                    
                case 'Escape':
                    closeAllDropdowns();
                    input.blur();
                    break;
            }
        });
        
        // Add getter methods to container for form validation
        container.getValue = function() {
            return selectedValue;
        };
        
        container.getText = function() {
            return selectedText;
        };
        
        container.setValue = function(value, text) {
            selectedValue = value;
            selectedText = text || value;
            input.value = selectedText;
            
            // Update selected item
            items.forEach(item => {
                item.classList.remove('selected');
                if (item.getAttribute('data-value') === value) {
                    item.classList.add('selected');
                }
            });
        };
        
        // Set default values for specific dropdowns
        const label = container.closest('.form-group').querySelector('label').textContent;
        
        if (label.includes('Product Designer')) {
            const adminSingItem = container.querySelector('[data-value="admin-sing"]');
            if (adminSingItem) {
                setTimeout(() => {
                    adminSingItem.click();
                }, 100);
            }
        } else if (label.includes('Category')) {
            const bathAccessoriesItem = container.querySelector('[data-value="bath-accessories"]');
            if (bathAccessoriesItem) {
                setTimeout(() => {
                    bathAccessoriesItem.click();
                }, 100);
            }
        } else if (label.includes('Bom Type')) {
            const standardBomItem = container.querySelector('[data-value="standard"]');
            if (standardBomItem) {
                setTimeout(() => {
                    standardBomItem.click();
                }, 100);
            }
        } else if (label.includes('Product Type')) {
            const cabinetItem = container.querySelector('[data-value="cabinet"]');
            if (cabinetItem) {
                setTimeout(() => {
                    cabinetItem.click();
                }, 100);
            }
        }
    });
    
    // Helper function to highlight item
    function highlightItem(items, index) {
        items.forEach((item, i) => {
            if (i === index) {
                item.style.backgroundColor = '#8e44ad';
                item.style.color = 'white';
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.style.backgroundColor = '';
                item.style.color = '#333';
            }
        });
    }
    
    // Close all dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.searchable-dropdown-container')) {
            closeAllDropdowns();
        }
    });
    
    // Close dropdowns function
    function closeAllDropdowns() {
        dropdownContainers.forEach(container => {
            const input = container.querySelector('.searchable-dropdown-input');
            const dropdown = container.querySelector('.searchable-dropdown-list');
            const arrow = container.querySelector('.searchable-dropdown-arrow');
            const items = container.querySelectorAll('.searchable-dropdown-item');
            
            dropdown.classList.remove('show');
            arrow.style.transform = 'translateY(-50%) rotate(0deg)';
            
            // Reset search if no selection was made
            if (!container.getValue()) {
                input.value = '';
            }
            
            input.setAttribute('readonly', 'readonly');
            
            // Show all items for next search
            items.forEach(item => {
                item.classList.remove('hidden');
                item.style.backgroundColor = '';
                item.style.color = '#333';
            });
            
            // Hide no results message
            const noResultsDiv = dropdown.querySelector('.searchable-dropdown-no-results');
            if (noResultsDiv) {
                noResultsDiv.style.display = 'none';
            }
        });
    }
}

// BOM Type conditional fields functionality
function initializeBomTypeConditionalFields() {
    const bomTypeContainer = document.getElementById('bom-type-dropdown');
    if (!bomTypeContainer) return;
    
    const bomTypeInput = bomTypeContainer.querySelector('.searchable-dropdown-input');
    const bomTypeItems = bomTypeContainer.querySelectorAll('.searchable-dropdown-item');
    const buyerFields = document.querySelectorAll('.buyer-fields');
    
    // Function to show/hide buyer fields
    function toggleBuyerFields(show) {
        buyerFields.forEach(field => {
            if (show) {
                field.style.display = 'block';
                field.style.animation = 'slideDown 0.3s ease';
                // Add required attribute to buyer name field
                const buyerNameInput = field.querySelector('.searchable-dropdown-input');
                if (buyerNameInput && field.id === 'buyer-name-field') {
                    field.querySelector('.searchable-dropdown-container').setAttribute('data-required', 'true');
                }
            } else {
                field.style.display = 'none';
                // Remove required attribute from buyer name field
                const buyerNameInput = field.querySelector('.searchable-dropdown-input');
                if (buyerNameInput && field.id === 'buyer-name-field') {
                    field.querySelector('.searchable-dropdown-container').removeAttribute('data-required');
                    buyerNameInput.value = '';
                }
                // Clear buyer SKU field
                const buyerSkuInput = field.querySelector('input[type="text"]');
                if (buyerSkuInput) {
                    buyerSkuInput.value = '';
                }
                // Uncheck "Only For Buyer" checkbox
                const onlyForBuyerCheckbox = field.querySelector('#only-for-buyer');
                if (onlyForBuyerCheckbox) {
                    onlyForBuyerCheckbox.checked = false;
                    
                    // onlyForBuyerCheckbox.removeAttribute('required');
                }
            }
        });
    }
    
    // Handle BOM Type selection
    bomTypeItems.forEach(item => {
        item.addEventListener('click', function() {
            const selectedValue = this.getAttribute('data-value');
            
            // Show buyer fields only when "Buyer Prd" (Bp) is selected
            if (selectedValue === 'Bp') {
                toggleBuyerFields(true);
            } else {
                toggleBuyerFields(false);
            }
        });
    });
    
    // Also handle direct input changes
    bomTypeInput.addEventListener('change', function() {
        const inputValue = this.value;
        if (inputValue === 'Buyer Prd') {
            toggleBuyerFields(true);
        } else {
            toggleBuyerFields(false);
        }
    });
}

// Set Status conditional fields functionality
function initializeSetStatusConditionalFields() {
    const setStatusDropdown = document.getElementById('set-status-dropdown');
    const partTypeDropdown = document.getElementById('part-type-dropdown');
    
    if (!setStatusDropdown || !partTypeDropdown) return;
    
    // Store original part type options
    const originalPartTypeOptions = [
        { value: '', text: 'Select Part Type' },
        { value: 'component', text: 'Component' },
        { value: 'assembly', text: 'Assembly' },
        { value: 'sub-assembly', text: 'Sub Assembly' },
        { value: 'raw-material', text: 'Raw Material' },
        { value: 'finished-goods', text: 'Finished Goods' },
        { value: 'hardware', text: 'Hardware' },
        { value: 'accessory', text: 'Accessory' }
    ];
    
    // Create numbered options for Set status
    const setPartTypeOptions = [
        { value: '', text: 'Select Part Type' },
        { value: '1', text: '1' },
        { value: '2', text: '2' },
        { value: '3', text: '3' },
        { value: '4', text: '4' },
        { value: '5', text: '5' },
        { value: '6', text: '6' },
        { value: '7', text: '7' },
        { value: '8', text: '8' },
        { value: '9', text: '9' },
        { value: '10', text: '10' },
        { value: '11', text: '11' },
        { value: '12', text: '12' },
        { value: '13', text: '13' },
        { value: '14', text: '14' },
        { value: '15', text: '15' }
    ];
    
    // Function to update Part Type options
    function updatePartTypeOptions(isSet) {
        const currentValue = partTypeDropdown.value;
        partTypeDropdown.innerHTML = '';
        
        const optionsToUse = isSet ? setPartTypeOptions : originalPartTypeOptions;
        
        optionsToUse.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            partTypeDropdown.appendChild(optionElement);
        });
        
        // Try to preserve selection if it exists in new options
        if (currentValue && optionsToUse.some(opt => opt.value === currentValue)) {
            partTypeDropdown.value = currentValue;
        } else {
            partTypeDropdown.value = '';
        }
        
        // Add visual feedback
        partTypeDropdown.style.backgroundColor = '#e8f5e8';
        partTypeDropdown.style.transition = 'background-color 0.3s ease';
        setTimeout(() => {
            partTypeDropdown.style.backgroundColor = '';
        }, 1000);
    }
    
    // Handle Set Status selection
    setStatusDropdown.addEventListener('change', function() {
        const selectedValue = this.value;
        
        if (selectedValue === 'set') {
            updatePartTypeOptions(true);
            console.log('Set Status: Set selected - Part Type options changed to numbers 1-15');
        } else {
            updatePartTypeOptions(false);
            console.log('Set Status: Single/Default selected - Part Type options restored to original');
        }
    });
}

// Other Detail conditional fields functionality
function initializeOtherDetailConditionalFields() {
    const otherDetailCheckbox = document.getElementById('other-detail');
    const otherDetailFields = document.getElementById('other-detail-fields');
    
    if (!otherDetailCheckbox || !otherDetailFields) return;
    
    // Function to toggle other detail fields with sliding animation
    function toggleOtherDetailFields(show) {
        if (show) {
            // Show fields with slide down animation
            otherDetailFields.style.display = 'block';
            otherDetailFields.style.maxHeight = '0px';
            otherDetailFields.style.opacity = '0';
            otherDetailFields.style.transition = 'max-height 0.5s ease-out, opacity 0.3s ease-out';
            
            // Force reflow to ensure initial styles are applied
            otherDetailFields.offsetHeight;
            
            // Calculate the full height needed
            const fullHeight = otherDetailFields.scrollHeight;
            
            // Animate to full height
            setTimeout(() => {
                otherDetailFields.style.maxHeight = fullHeight + 'px';
                otherDetailFields.style.opacity = '1';
            }, 10);
            
            // Clean up after animation
            setTimeout(() => {
                otherDetailFields.style.maxHeight = 'none';
            }, 600);
            
            console.log('Other Detail fields shown with sliding animation');
        } else {
            // Hide fields with slide up animation
            const currentHeight = otherDetailFields.scrollHeight;
            otherDetailFields.style.maxHeight = currentHeight + 'px';
            otherDetailFields.style.transition = 'max-height 0.4s ease-in, opacity 0.2s ease-in';
            
            // Force reflow
            otherDetailFields.offsetHeight;
            
            // Animate to closed
            setTimeout(() => {
                otherDetailFields.style.maxHeight = '0px';
                otherDetailFields.style.opacity = '0';
            }, 10);
            
            // Hide completely after animation
            setTimeout(() => {
                otherDetailFields.style.display = 'none';
                otherDetailFields.style.maxHeight = '';
                otherDetailFields.style.opacity = '';
                otherDetailFields.style.transition = '';
            }, 500);
            
            // Clear all field values when hiding
            const inputs = otherDetailFields.querySelectorAll('input, select');
            inputs.forEach(input => {
                if (input.type === 'number' || input.type === 'text') {
                    input.value = '';
                } else if (input.tagName === 'SELECT') {
                    input.selectedIndex = 0;
                }
            });
            
            console.log('Other Detail fields hidden with sliding animation and values cleared');
        }
    }
    
    // Handle checkbox change
    otherDetailCheckbox.addEventListener('change', function() {
        const isChecked = this.checked;
        toggleOtherDetailFields(isChecked);
        
        // Add visual feedback to checkbox label
        const label = this.nextElementSibling;
        if (isChecked) {
            label.style.color = '#8e44ad';
            label.style.fontWeight = 'bold';
        } else {
            label.style.color = '';
            label.style.fontWeight = '';
        }
    });
}

// Product Search Modal functionality
function initializeProductSearchModal() {
    const searchButton = document.querySelector('.search-btn');
    const modal = document.getElementById('product-search-modal');
    const modalClose = document.getElementById('product-search-modal-close');
    const okButton = document.getElementById('product-search-ok-btn');
    
    if (!searchButton || !modal) return;
    
    // Show modal when search button is clicked
    searchButton.addEventListener('click', function(e) {
        e.preventDefault();
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
    
    // Hide modal when close button is clicked
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        });
    }
    
    // Hide modal when OK button is clicked
    if (okButton) {
        okButton.addEventListener('click', function() {
            // Get selected product (if any)
            const selectedRadio = modal.querySelector('input[name="product-select"]:checked');
            if (selectedRadio) {
                // Here you can handle the selected product data
                console.log('Selected product:', selectedRadio.closest('tr'));
            }
            
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        });
    }
    
    // Hide modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
    
    // Handle search within modal
    const searchBtnModal = modal.querySelector('.search-btn-modal');
    if (searchBtnModal) {
        searchBtnModal.addEventListener('click', function() {
            // Here you can implement the actual search functionality
            console.log('Searching products...');
            // For now, just show a message
            alert('Search functionality would be implemented here');
        });
    }
}

// Chief Materials Weights Modal functionality
function initializeChiefMaterialsModal() {
    const cmWgtButton = document.querySelector('.cm-wgt-btn');
    const modal = document.getElementById('chief-materials-modal');
    const modalClose = document.getElementById('materials-modal-close');
    const okButton = document.getElementById('materials-ok-btn');
    
    if (!cmWgtButton || !modal) return;
    
    // Show modal when CM. WGT. button is clicked
    cmWgtButton.addEventListener('click', function(e) {
        e.preventDefault();
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
    
    // Hide modal when close button is clicked
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        });
    }
    
    // Hide modal when OK button is clicked
    if (okButton) {
        okButton.addEventListener('click', function() {
            // Calculate total weight and update percentages
            calculateMaterialPercentages();
            
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        });
    }
    
    // Hide modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
    
    // Add event listeners to weight inputs for real-time percentage calculation
    const weightInputs = modal.querySelectorAll('input[type="number"]:not([readonly])');
    weightInputs.forEach(input => {
        input.addEventListener('input', function() {
            calculateMaterialPercentages();
        });
    });
}

// Calculate material weight percentages
function calculateMaterialPercentages() {
    const modal = document.getElementById('chief-materials-modal');
    if (!modal) return;
    
    const rows = modal.querySelectorAll('tbody tr');
    let totalWeight = 0;
    const weights = [];
    
    // First pass: collect all weights and calculate total
    rows.forEach((row, index) => {
        const weightInput = row.querySelector('td:nth-child(2) input');
        const weight = parseFloat(weightInput.value) || 0;
        weights[index] = weight;
        totalWeight += weight;
    });
    
    // Second pass: calculate and update percentages
    rows.forEach((row, index) => {
        const percentageInput = row.querySelector('td:nth-child(3) input');
        if (totalWeight > 0) {
            const percentage = (weights[index] / totalWeight) * 100;
            percentageInput.value = percentage.toFixed(2);
        } else {
            percentageInput.value = '';
        }
    });
}

// Shelve conditional field functionality
function initializeShelveConditionalField() {
    const shelveDropdown = document.getElementById('shelve-dropdown');
    const shelveNoField = document.getElementById('shelve-no-field');
    
    if (!shelveDropdown || !shelveNoField) return;
    
    shelveDropdown.addEventListener('change', function() {
        const selectedValue = this.value;
        
        if (selectedValue === 'yes') {
            // Show Shelve No. field with sliding animation
            shelveNoField.style.display = 'block';
            shelveNoField.style.maxHeight = '0';
            shelveNoField.style.opacity = '0';
            shelveNoField.style.overflow = 'hidden';
            shelveNoField.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
            
            // Trigger animation
            setTimeout(() => {
                shelveNoField.style.maxHeight = '100px';
                shelveNoField.style.opacity = '1';
            }, 10);
            
            console.log('Shelve No. field shown');
        } else {
            // Hide Shelve No. field with sliding animation
            shelveNoField.style.maxHeight = '0';
            shelveNoField.style.opacity = '0';
            
            setTimeout(() => {
                shelveNoField.style.display = 'none';
                // Clear the input value when hiding
                const input = shelveNoField.querySelector('input');
                if (input) {
                    input.value = '';
                }
            }, 300);
            
            console.log('Shelve No. field hidden');
        }
    });
}

// Mattress conditional field functionality
function initializeMattressConditionalField() {
    const mattressDropdown = document.getElementById('mattress-dropdown');
    const mattressNoField = document.getElementById('mattress-no-field');
    
    if (!mattressDropdown || !mattressNoField) return;
    
    mattressDropdown.addEventListener('change', function() {
        const selectedValue = this.value;
        
        if (selectedValue === 'yes') {
            // Show Mattress No. field with sliding animation
            mattressNoField.style.display = 'block';
            mattressNoField.style.maxHeight = '0';
            mattressNoField.style.opacity = '0';
            mattressNoField.style.overflow = 'hidden';
            mattressNoField.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
            
            // Trigger animation
            setTimeout(() => {
                mattressNoField.style.maxHeight = '100px';
                mattressNoField.style.opacity = '1';
            }, 10);
            
            console.log('Mattress No. field shown');
        } else {
            // Hide Mattress No. field with sliding animation
            mattressNoField.style.maxHeight = '0';
            mattressNoField.style.opacity = '0';
            
            setTimeout(() => {
                mattressNoField.style.display = 'none';
                // Clear the input value when hiding
                const input = mattressNoField.querySelector('input');
                if (input) {
                    input.value = '';
                }
            }, 300);
            
            console.log('Mattress No. field hidden');
        }
    });
}

// Vriksha Req conditional field functionality for Sheesham Weight
function initializeVrikshaReqConditionalField() {
    const vrikshaReqDropdown = document.getElementById('vriksha-req-dropdown');
    const sheeshamWeightInput = document.getElementById('sheesham-weight-input');
    
    if (!vrikshaReqDropdown || !sheeshamWeightInput) return;
    
    vrikshaReqDropdown.addEventListener('change', function() {
        const selectedValue = this.value;
        
        if (selectedValue === 'yes') {
            // Enable Sheesham Weight field
            sheeshamWeightInput.disabled = false;
            sheeshamWeightInput.style.backgroundColor = '';
            sheeshamWeightInput.style.cursor = 'text';
            sheeshamWeightInput.focus();
            
            console.log('Sheesham Weight field enabled');
        } else {
            // Disable Sheesham Weight field and clear value
            sheeshamWeightInput.disabled = true;
            sheeshamWeightInput.style.backgroundColor = 'rgba(128, 128, 128, 0.24)';
            sheeshamWeightInput.style.cursor = 'not-allowed';
            sheeshamWeightInput.value = '';
            
            console.log('Sheesham Weight field disabled and cleared');
        }
    });
} 

// Automatic Box Gross Weight calculation functionality
function initializeBoxGrossWeightCalculation() {
    const netWeightInput = document.getElementById('net-weight-input');
    const grossWeightInput = document.getElementById('gross-weight-input');
    const boxGrossWeightInput = document.getElementById('box-gross-weight-input');
    
    if (!netWeightInput || !grossWeightInput || !boxGrossWeightInput) return;
    
    function calculateBoxGrossWeight() {
        const netWeight = parseFloat(netWeightInput.value) || 0;
        const grossWeight = parseFloat(grossWeightInput.value) || 0;
        
        if (netWeight > 0 && grossWeight > 0) {
            // Box Gross Weight = Gross Weight - Net Weight (packaging weight)
            // Or alternatively: Box Gross Weight = Net Weight + packaging weight
            // Using standard packaging weight assumption of 10-15% of net weight
            const packagingWeight = netWeight * 0.12; // 12% packaging weight
            const boxGrossWeight = netWeight + packagingWeight;
            
            boxGrossWeightInput.value = boxGrossWeight.toFixed(2);
            
            // Add visual feedback
            boxGrossWeightInput.style.backgroundColor = '#e8f5e8';
            boxGrossWeightInput.style.transition = 'background-color 0.3s ease';
            setTimeout(() => {
                boxGrossWeightInput.style.backgroundColor = 'rgba(128, 128, 128, 0.24)';
            }, 1500);
            
            console.log(`Box Gross Weight calculated: ${boxGrossWeight.toFixed(2)} kg (Net: ${netWeight} kg + Packaging: ${packagingWeight.toFixed(2)} kg)`);
        } else if (netWeight > 0) {
            // If only net weight is available, calculate with standard packaging
            const packagingWeight = netWeight * 0.12;
            const boxGrossWeight = netWeight + packagingWeight;
            
            boxGrossWeightInput.value = boxGrossWeight.toFixed(2);
            
            // Add visual feedback
            boxGrossWeightInput.style.backgroundColor = '#e8f5e8';
            boxGrossWeightInput.style.transition = 'background-color 0.3s ease';
            setTimeout(() => {
                boxGrossWeightInput.style.backgroundColor = 'rgba(128, 128, 128, 0.24)';
            }, 1500);
        } else {
            boxGrossWeightInput.value = '';
        }
    }
    
    // Add event listeners for real-time calculation
    netWeightInput.addEventListener('input', calculateBoxGrossWeight);
    netWeightInput.addEventListener('change', calculateBoxGrossWeight);
    grossWeightInput.addEventListener('input', calculateBoxGrossWeight);
    grossWeightInput.addEventListener('change', calculateBoxGrossWeight);
    
    // Initial calculation if values are already present
    calculateBoxGrossWeight();
}

// Box Details Section functionality - Multiple dynamic rows
function initializeBoxDetailsSection() {
    const addBoxBtn = document.getElementById('add-box-btn');
    const boxContainer = document.getElementById('box-details-container');
    let boxCounter = 0;
    
    if (!addBoxBtn || !boxContainer) return;
    
    // Add new box row when + Box button is clicked
    addBoxBtn.addEventListener('click', function(e) {
        e.preventDefault();
        addNewBoxRow();
    });
    
    function addNewBoxRow() {
        boxCounter++;
        
        // Show container if hidden
        if (boxContainer.style.display === 'none' || !boxContainer.style.display) {
            boxContainer.style.display = 'block';
            boxContainer.style.opacity = '0';
            boxContainer.style.transform = 'translateY(-10px)';
            boxContainer.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                boxContainer.style.opacity = '1';
                boxContainer.style.transform = 'translateY(0)';
            }, 10);
        }
        
        // Create new box row
        const boxRow = document.createElement('div');
        boxRow.className = 'box-row';
        boxRow.setAttribute('data-box-id', boxCounter);
        
        boxRow.innerHTML = `
            <div class="dimension-grid" style="border: 1px solid #e0e0e0; border-radius: 6px; padding: 15px; margin-bottom: 15px; background: #fafafa;">
                <div class="form-group">
                    <label>Carton Type</label>
                    <select class="carton-type">
                        <option value="">Dummy</option>
                        <option value="standard">Standard</option>
                        <option value="custom">Custom</option>
                        <option value="heavy-duty">Heavy Duty</option>
                        <option value="export">Export</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Unit</label>
                    <select class="box-unit">
                        <option value="">Select Unit</option>
                        <option value="inch">inch</option>
                        <option value="cm">cm</option>
                        <option value="mm">mm</option>
                        <option value="feet">feet</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Length</label>
                    <input type="number" placeholder="L" class="box-length">
                </div>
                <div class="form-group">
                    <label>Width</label>
                    <input type="number" placeholder="W" class="box-width">
                </div>
                <div class="form-group">
                    <label>Height</label>
                    <input type="number" placeholder="H" class="box-height">
                </div>
                <div class="form-group">
                    <label>Box Area</label>
                    <input type="text" placeholder="Area" class="box-area" style="background-color: rgba(128, 128, 128, 0.24);" readonly>
                </div>
                <div class="form-group">
                    <label>PCS/Carton</label>
                    <input type="number" placeholder="PCS/Carton" class="pcs-carton">
                </div>
                <div class="form-group">
                    <label>No Of Box</label>
                    <input type="number" placeholder="No Of Box" class="no-of-box">
                </div>
                <div class="form-group">
                    <label>CBM/PCS</label>
                    <input type="text" placeholder="CBM/PCS" class="cbm-pcs" style="background-color: rgba(128, 128, 128, 0.24);" readonly>
                </div>
                <div class="form-group">
                    <label>Box Wt (Kg.)</label>
                    <input type="text" placeholder="GrossWt" class="box-weight" style="background-color: rgba(128, 128, 128, 0.24);" readonly>
                </div>
                <div class="form-group">
                    <button class="remove-box-btn" style="background-color: #dc3545; color: white; border: none; padding: 6px 10px; border-radius: 3px; cursor: pointer;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        
        boxContainer.appendChild(boxRow);
        
        // Add event listeners for this row
        setupBoxRowEventListeners(boxRow);
        
        // Animate the new row
        boxRow.style.opacity = '0';
        boxRow.style.transform = 'translateY(-10px)';
        boxRow.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            boxRow.style.opacity = '1';
            boxRow.style.transform = 'translateY(0)';
        }, 10);
        
        console.log(`Added box row ${boxCounter}`);
    }
    
    function setupBoxRowEventListeners(boxRow) {
        const lengthInput = boxRow.querySelector('.box-length');
        const widthInput = boxRow.querySelector('.box-width');
        const heightInput = boxRow.querySelector('.box-height');
        const areaInput = boxRow.querySelector('.box-area');
        const pcsCartonInput = boxRow.querySelector('.pcs-carton');
        const noOfBoxInput = boxRow.querySelector('.no-of-box');
        const cbmPcsInput = boxRow.querySelector('.cbm-pcs');
        const boxWeightInput = boxRow.querySelector('.box-weight');
        const unitSelect = boxRow.querySelector('.box-unit');
        const removeBtn = boxRow.querySelector('.remove-box-btn');
        
        // Auto-calculate box area when dimensions change
        function calculateBoxArea() {
            const length = parseFloat(lengthInput.value) || 0;
            const width = parseFloat(widthInput.value) || 0;
            const height = parseFloat(heightInput.value) || 0;
            
            if (length > 0 && width > 0 && height > 0) {
                const area = length * width * height;
                areaInput.value = area.toFixed(4);
                
                // Visual feedback
                areaInput.style.backgroundColor = '#e8f5e8';
                setTimeout(() => {
                    areaInput.style.backgroundColor = 'rgba(128, 128, 128, 0.24)';
                }, 1500);
                
                // Calculate CBM/PCS
                calculateCbmPcs();
            } else {
                areaInput.value = '';
                cbmPcsInput.value = '';
                boxWeightInput.value = '';
            }
        }
        
        // Auto-calculate CBM/PCS
        function calculateCbmPcs() {
            const area = parseFloat(areaInput.value) || 0;
            const pcsCarton = parseFloat(pcsCartonInput.value) || 0;
            
            if (area > 0 && pcsCarton > 0) {
                const unit = unitSelect.value || 'inch';
                
                let cbmArea = 0;
                switch(unit) {
                    case 'inch':
                        cbmArea = area * 0.000016387064; // cubic inches to cubic meters
                        break;
                    case 'cm':
                        cbmArea = area * 0.000001; // cubic cm to cubic meters
                        break;
                    case 'mm':
                        cbmArea = area * 0.000000001; // cubic mm to cubic meters
                        break;
                    case 'feet':
                        cbmArea = area * 0.0283168466; // cubic feet to cubic meters
                        break;
                    default:
                        cbmArea = area * 0.000016387064;
                }
                
                const cbmPcs = cbmArea / pcsCarton;
                cbmPcsInput.value = cbmPcs.toFixed(6);
                
                // Visual feedback
                cbmPcsInput.style.backgroundColor = '#e8f5e8';
                setTimeout(() => {
                    cbmPcsInput.style.backgroundColor = 'rgba(128, 128, 128, 0.24)';
                }, 1500);
                
                // Calculate box weight
                calculateBoxWeight();
            } else {
                cbmPcsInput.value = '';
                boxWeightInput.value = '';
            }
        }
        
        // Auto-calculate box weight
        function calculateBoxWeight() {
            const cbmPcs = parseFloat(cbmPcsInput.value) || 0;
            const pcsCarton = parseFloat(pcsCartonInput.value) || 0;
            const noOfBox = parseFloat(noOfBoxInput.value) || 0;
            
            // Get gross weight from main dimension section
            const mainGrossWeightInput = document.getElementById('gross-weight-input');
            const grossWeight = mainGrossWeightInput ? parseFloat(mainGrossWeightInput.value) || 0 : 0;
            
            if (cbmPcs > 0 && pcsCarton > 0 && grossWeight > 0) {
                let boxWeight = grossWeight * pcsCarton;
                
                // If number of boxes is specified, multiply by that
                if (noOfBox > 0) {
                    boxWeight = boxWeight * noOfBox;
                }
                
                boxWeightInput.value = boxWeight.toFixed(2);
                
                // Visual feedback
                boxWeightInput.style.backgroundColor = '#e8f5e8';
                setTimeout(() => {
                    boxWeightInput.style.backgroundColor = 'rgba(128, 128, 128, 0.24)';
                }, 1500);
            } else {
                boxWeightInput.value = '';
            }
        }
        
        // Add event listeners for calculations
        lengthInput.addEventListener('input', calculateBoxArea);
        lengthInput.addEventListener('change', calculateBoxArea);
        widthInput.addEventListener('input', calculateBoxArea);
        widthInput.addEventListener('change', calculateBoxArea);
        heightInput.addEventListener('input', calculateBoxArea);
        heightInput.addEventListener('change', calculateBoxArea);
        pcsCartonInput.addEventListener('input', calculateCbmPcs);
        pcsCartonInput.addEventListener('change', calculateCbmPcs);
        noOfBoxInput.addEventListener('input', calculateBoxWeight);
        noOfBoxInput.addEventListener('change', calculateBoxWeight);
        unitSelect.addEventListener('change', calculateBoxArea);
        
        // Remove row functionality
        removeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Animate out
            boxRow.style.opacity = '0';
            boxRow.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                boxRow.remove();
                
                // Hide container if no more rows
                if (boxContainer.children.length === 0) {
                    boxContainer.style.display = 'none';
                }
                
                console.log('Removed box row');
            }, 300);
        });
    }
}

// Upload Modal functionality
function initializeUploadModal() {
    const paperclipIcon = document.getElementById('paperclip-icon');
    const uploadModal = document.getElementById('upload-modal');
    const closeBtn = document.getElementById('upload-modal-close');
    const okBtn = document.getElementById('upload-ok-btn');
    const multiImagesInput = document.getElementById('multi-images-input');
    const documentsInput = document.getElementById('documents-input');
    
    if (!paperclipIcon || !uploadModal) return;
    
    // Show modal when paperclip icon is clicked
    paperclipIcon.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showUploadModal();
    });
    
    // Close modal when close button is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            hideUploadModal();
        });
    }
    
    // Close modal when OK button is clicked
    if (okBtn) {
        okBtn.addEventListener('click', function(e) {
            e.preventDefault();
            hideUploadModal();
        });
    }
    
    // Close modal when clicking outside
    uploadModal.addEventListener('click', function(e) {
        if (e.target === uploadModal) {
            hideUploadModal();
        }
    });
    
    // Handle file selection for multi images
    if (multiImagesInput) {
        multiImagesInput.addEventListener('change', function(e) {
            const files = e.target.files;
            const statusSpan = this.closest('.file-upload-area').querySelector('.file-status');
            
            if (files.length > 0) {
                if (files.length === 1) {
                    statusSpan.textContent = `${files[0].name}`;
                } else {
                    statusSpan.textContent = `${files.length} files selected`;
                }
                statusSpan.style.color = '#28a745';
            } else {
                statusSpan.textContent = 'No file chosen';
                statusSpan.style.color = '#666';
            }
        });
    }
    
    // Handle file selection for documents
    if (documentsInput) {
        documentsInput.addEventListener('change', function(e) {
            const files = e.target.files;
            const statusSpan = this.closest('.file-upload-area').querySelector('.file-status');
            
            if (files.length > 0) {
                if (files.length === 1) {
                    statusSpan.textContent = `${files[0].name}`;
                } else {
                    statusSpan.textContent = `${files.length} files selected`;
                }
                statusSpan.style.color = '#28a745';
            } else {
                statusSpan.textContent = 'No file chosen';
                statusSpan.style.color = '#666';
            }
        });
    }
    
    function showUploadModal() {
        uploadModal.style.display = 'flex';
        uploadModal.style.opacity = '0';
        
        setTimeout(() => {
            uploadModal.style.opacity = '1';
        }, 10);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        console.log('Upload modal shown');
    }
    
    function hideUploadModal() {
        uploadModal.style.opacity = '0';
        
        setTimeout(() => {
            uploadModal.style.display = 'none';
            
            // Restore body scroll
            document.body.style.overflow = 'auto';
        }, 300);
        
        console.log('Upload modal hidden');
    }
    
    // Handle Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && uploadModal.style.display === 'flex') {
            hideUploadModal();
        }
    });
}