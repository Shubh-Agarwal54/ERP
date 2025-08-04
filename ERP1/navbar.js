// Simple navbar functionality
class NavbarManager {
    constructor() {
        this.init();
    }

    async init() {
        this.loadNavbar();
        setTimeout(() => this.setupEventListeners(), 100);
    }

    loadNavbar() {
        const navbarHTML = `
            <!-- Navigation Bar Component -->
            <header class="header">
                <div class="header-left">

                    <button class="sidebar-toggle" id="sidebarToggle">

                    <button class="mobile-menu-toggle" id="mobileMenuToggle">
                        <i class="fas fa-bars"></i>
                    </button>
                    <div class="logo">
                        <img src="./assets/images/ERP (2).png" alt="ERP Daddy" id="logo-img" class="logo-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';">
                        <span style="display:none; color: #007CC7; font-weight: bold;">ERP DADDY</span>
                            
                    </div>

                    <!-- Desktop Navigation Dropdown -->
                    <div class="desktop-nav-dropdown" id="desktopNavDropdown">
                        <button class="nav-dropdown-btn" id="navDropdownBtn" aria-expanded="false" aria-haspopup="true">
                            <i class="fas fa-bars"></i>
                            <span>Navigation</span>
                            <i class="fas fa-chevron-down dropdown-arrow"></i>
                        </button>
                        <div class="nav-dropdown-menu" id="navDropdownMenu">
                            <div class="nav-dropdown-content">
                                <a href="index.html" class="nav-dropdown-item">
                                    <i class="fas fa-tachometer-alt"></i>
                                    <span>Dashboard</span>
                                </a>
                                <a href="orders.html" class="nav-dropdown-item">
                                    <i class="fas fa-shopping-cart"></i>
                                    <span>Orders</span>
                                </a>
                                <a href="products.html" class="nav-dropdown-item">
                                    <i class="fas fa-box"></i>
                                    <span>Products/Services</span>
                                </a>
                                <a href="customers.html" class="nav-dropdown-item">
                                    <i class="fas fa-users"></i>
                                    <span>Customers</span>
                                </a>
                                <a href="#" class="nav-dropdown-item">
                                    <i class="fas fa-warehouse"></i>
                                    <span>Sampling</span>
                                </a>
                                <a href="#" class="nav-dropdown-item">
                                    <i class="fas fa-user-tie"></i>
                                    <span>Sales Manager</span>
                                </a>
                                <a href="#" class="nav-dropdown-item">
                                    <i class="fas fa-chart-bar"></i>
                                    <span>CRM</span>
                                </a>
                                <a href="#" class="nav-dropdown-item">
                                    <i class="fas fa-clipboard-list"></i>
                                    <span>Order Sheet</span>
                                </a>
                                <a href="#" class="nav-dropdown-item">
                                    <i class="fas fa-dollar-sign"></i>
                                    <span>Pricing</span>
                                </a>
                                <a href="#" class="nav-dropdown-item">
                                    <i class="fas fa-truck"></i>
                                    <span>Dispatch</span>
                                </a>
                                <a href="#" class="nav-dropdown-item">
                                    <i class="fas fa-industry"></i>
                                    <span>Production</span>
                                </a>
                                <a href="#" class="nav-dropdown-item">
                                    <i class="fas fa-file-invoice"></i>
                                    <span>Billing</span>
                                </a>
                                <a href="#" class="nav-dropdown-item">
                                    <i class="fas fa-chart-pie"></i>
                                    <span>Report/Analysis</span>
                                </a>
                                <a href="#" class="nav-dropdown-item">
                                    <i class="fas fa-file-alt"></i>
                                    <span>Accounts</span>
                                </a>
                                <a href="#" class="nav-dropdown-item">
                                    <i class="fas fa-cog"></i>
                                    <span>Settings</span>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
                
              
                <div class="header-right">
                    <div class="header-icons">
                        <div class="icon-item">
                            <button class="icon-btn" id="messagesBtn" title="Messages">
                                <i class="fas fa-envelope"></i>
                                <span class="notification-badge">3</span>
                            </button>
                        </div>
                        <div class="icon-item">
                            <button class="icon-btn" id="notificationsBtn" title="Notifications">
                                <i class="fas fa-bell"></i>
                                <span class="notification-badge">5</span>
                            </button>
                        </div>
                    </div>
                    <div class="user-menu">
                        <div class="user-profile" id="userProfileBtn">
                            <img src="https://shorturl.at/vU9RW" alt="User" class="user-avatar">
                            <span>John Doe</span>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Mobile Navigation Menu -->
            <div class="mobile-nav-menu" id="mobileNavMenu">
                <div class="mobile-nav-content">
                    <a href="index.html" class="mobile-nav-item">
                        <i class="fas fa-tachometer-alt"></i>
                        <span>Dashboard</span>
                    </a>
                    <a href="orders.html" class="mobile-nav-item">
                        <i class="fas fa-shopping-cart"></i>
                        <span>Orders</span>
                    </a>
                    <a href="products.html" class="mobile-nav-item">
                        <i class="fas fa-box"></i>
                        <span>Products/Services</span>
                    </a>
                    <a href="customers.html" class="mobile-nav-item">
                        <i class="fas fa-users"></i>
                        <span>Customers</span>
                    </a>
                    <a href="#" class="mobile-nav-item">
                        <i class="fas fa-warehouse"></i>
                        <span>Sampling</span>
                    </a>
                    <a href="#" class="mobile-nav-item">
                        <i class="fas fa-user-tie"></i>
                        <span>Sales Manager</span>
                    </a>
                    <a href="#" class="mobile-nav-item">
                        <i class="fas fa-chart-bar"></i>
                        <span>CRM</span>
                    </a>
                    <a href="#" class="mobile-nav-item">
                        <i class="fas fa-clipboard-list"></i>
                        <span>Order Sheet</span>
                    </a>
                    <a href="#" class="mobile-nav-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span>Pricing</span>
                    </a>
                    <a href="#" class="mobile-nav-item">
                        <i class="fas fa-truck"></i>
                        <span>Dispatch</span>
                    </a>
                    <a href="#" class="mobile-nav-item">
                        <i class="fas fa-industry"></i>
                        <span>Production</span>
                    </a>
                    <a href="#" class="mobile-nav-item">
                        <i class="fas fa-file-invoice"></i>
                        <span>Billing</span>
                    </a>
                    <a href="#" class="mobile-nav-item">
                        <i class="fas fa-chart-pie"></i>
                        <span>Report/Analysis</span>
                    </a>
                    <a href="#" class="mobile-nav-item">
                        <i class="fas fa-file-alt"></i>
                        <span>Accounts</span>
                    </a>
                    <a href="#" class="mobile-nav-item">
                        <i class="fas fa-cog"></i>
                        <span>Settings</span>
                    </a>
                </div>
            </div>

            <!-- Dropdown Menus -->
            <div class="dropdown-menu user-dropdown" id="userDropdown">
                <div class="dropdown-content">
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-user"></i>
                        <span>My Profile</span>
                    </a>
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-cog"></i>
                        <span>Settings</span>
                    </a>
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-bell"></i>
                        <span>Preferences</span>
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </a>
                </div>
            </div>

            <div class="dropdown-menu messages-dropdown" id="messagesDropdown">
                <div class="dropdown-header">
                    <h3>Messages</h3>
                    <span class="view-all">View All</span>
                </div>
                <div class="dropdown-content">
                    <div class="message-item">
                        <div class="message-avatar">
                            <img src="https://via.placeholder.com/40" alt="User">
                        </div>
                        <div class="message-content">
                            <div class="message-header">
                                <span class="sender">Sarah Johnson</span>
                                <span class="time">2min ago</span>
                            </div>
                            <p class="message-text">Order #1234 has been processed successfully...</p>
                        </div>
                    </div>
                    <div class="message-item">
                        <div class="message-avatar">
                            <img src="https://via.placeholder.com/40" alt="User">
                        </div>
                        <div class="message-content">
                            <div class="message-header">
                                <span class="sender">Mike Chen</span>
                                <span class="time">15min ago</span>
                            </div>
                            <p class="message-text">New customer inquiry about bulk orders...</p>
                        </div>
                    </div>
                    <div class="message-item">
                        <div class="message-avatar">
                            <img src="https://via.placeholder.com/40" alt="User">
                        </div>
                        <div class="message-content">
                            <div class="message-header">
                                <span class="sender">Emma Davis</span>
                                <span class="time">1hr ago</span>
                            </div>
                            <p class="message-text">Payment confirmation received for order...</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="dropdown-menu notifications-dropdown" id="notificationsDropdown">
                <div class="dropdown-header">
                    <h3>Notifications</h3>
                    <span class="view-all">View All</span>
                </div>
                <div class="dropdown-content">
                    <div class="notification-item">
                        <div class="notification-icon success">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-header">
                                <span class="title">Order Completed</span>
                                <span class="time">5min ago</span>
                            </div>
                            <p class="notification-text">Order #1245 has been completed and shipped</p>
                        </div>
                    </div>
                    <div class="notification-item">
                        <div class="notification-icon warning">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-header">
                                <span class="title">Low Stock Alert</span>
                                <span class="time">30min ago</span>
                            </div>
                            <p class="notification-text">Product XYZ is running low on stock</p>
                        </div>
                    </div>
                    <div class="notification-item">
                        <div class="notification-icon info">
                            <i class="fas fa-info-circle"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-header">
                                <span class="title">System Update</span>
                                <span class="time">2hr ago</span>
                            </div>
                            <p class="notification-text">System maintenance scheduled for tonight</p>
                        </div>
                    </div>
                    <div class="notification-item">
                        <div class="notification-icon success">
                            <i class="fas fa-user-plus"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-header">
                                <span class="title">New Customer</span>
                                <span class="time">3hr ago</span>
                            </div>
                            <p class="notification-text">New customer registration: ABC Corp</p>
                        </div>
                    </div>
                    <div class="notification-item">
                        <div class="notification-icon error">
                            <i class="fas fa-times-circle"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-header">
                                <span class="title">Payment Failed</span>
                                <span class="time">4hr ago</span>
                            </div>
                            <p class="notification-text">Payment failed for order #1243</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Insert navbar at the beginning of body
        document.body.insertAdjacentHTML('afterbegin', navbarHTML);
        
        // Re-initialize mobile navigation after navbar is loaded
        if (typeof setupMobileNavigation === 'function') {
            setupMobileNavigation();
        }
    }

    setupEventListeners() {
        // Desktop navigation dropdown
        // const navDropdownBtn = document.getElementById('navDropdownBtn');
        // const navDropdownMenu = document.getElementById('navDropdownMenu');
        
        // if (navDropdownBtn) {
        //     navDropdownBtn.onclick = (e) => {
        //         // e.preventDefault();
        //         // e.stopPropagation();
        //         this.toggleDropdown('navDropdownMenu');
        //     };
        // }
        
        // Simple click handlers - no overcomplicated logic
        document.getElementById('messagesBtn').onclick = () => {
            this.toggleDropdown('messagesDropdown');
        };
        
        document.getElementById('notificationsBtn').onclick = () => {
            this.toggleDropdown('notificationsDropdown');
        };
        
        document.getElementById('userProfileBtn').onclick = () => {
            this.toggleDropdown('userDropdown');
        };
        
        document.getElementById('mobileMenuToggle').onclick = () => {
            this.toggleDropdown('mobileNavMenu');
        };
        
        // Click outside to close
        document.onclick = (e) => {
            if (!e.target.closest('.icon-btn') && 
                !e.target.closest('.dropdown-menu') && 
                !e.target.closest('.user-profile') && 
                !e.target.closest('.mobile-menu-toggle') && 
                !e.target.closest('.mobile-nav-menu') &&
                !e.target.closest('.nav-dropdown-btn') &&
                !e.target.closest('.nav-dropdown-menu')) {
                document.querySelectorAll('.dropdown-menu, .mobile-nav-menu, .nav-dropdown-menu').forEach(d => d.classList.remove('show'));
            }
        };
    }

    toggleDropdown(dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        
        // Close all others first
        document.querySelectorAll('.dropdown-menu, .mobile-nav-menu, .nav-dropdown-menu').forEach(d => {
            if (d.id !== dropdownId) d.classList.remove('show');
        });
        
        // Toggle this one
        dropdown.classList.toggle('show');
        
        // Update aria-expanded for nav dropdown button
        if (dropdownId === 'navDropdownMenu') {
            const navBtn = document.getElementById('navDropdownBtn');
            if (navBtn) {
                navBtn.setAttribute('aria-expanded', dropdown.classList.contains('show'));
            }
        }
    }
}

// Initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navbarManager = new NavbarManager();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavbarManager;
}
