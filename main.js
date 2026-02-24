// Main JavaScript File
// Handles navigation, loading, and general functionality

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initLoader();
    initNavigation();
    initSmoothScroll();
    initNavbarScroll();
});

// ============================================
// Loading Animation
// ============================================
function initLoader() {
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            if (loader) {
                loader.classList.add('hidden');
                setTimeout(function() {
                    loader.style.display = 'none';
                }, 500);
            }
        }, 500);
    });
}

// ============================================
// Navigation
// ============================================
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
}

// ============================================
// Navbar Scroll Effect
// ============================================
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// ============================================
// Smooth Scroll
// ============================================
function initSmoothScroll() {
    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#' || href === '') {
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Utility Functions
// ============================================

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Calculate number of nights
function calculateNights(checkin, checkout) {
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const diffTime = Math.abs(checkoutDate - checkinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Get room price
function getRoomPrice(roomType) {
    const prices = {
        'deluxe': 2500,
        'super-deluxe': 3500,
        'premium': 4000,
        'family-suite': 5000
    };
    return prices[roomType] || 0;
}

// Get room name
function getRoomName(roomType) {
    const names = {
        'deluxe': 'Deluxe Room',
        'super-deluxe': 'Super Deluxe Room',
        'premium': 'Premium Room',
        'family-suite': 'Family Suite'
    };
    return names[roomType] || roomType;
}

// Format currency
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

// Show error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Clear error message
function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone (Indian format)
function validatePhone(phone) {
    const re = /^[6-9]\d{9}$/;
    return re.test(phone.replace(/\D/g, ''));
}

// Validate date (check-in should be today or future, check-out should be after check-in)
function validateDates(checkin, checkout) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkinDate = new Date(checkin);
    checkinDate.setHours(0, 0, 0, 0);
    
    const checkoutDate = new Date(checkout);
    checkoutDate.setHours(0, 0, 0, 0);
    
    if (checkinDate < today) {
        return { valid: false, message: 'Check-in date cannot be in the past' };
    }
    
    if (checkoutDate <= checkinDate) {
        return { valid: false, message: 'Check-out date must be after check-in date' };
    }
    
    return { valid: true };
}

// Show modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Hide modal
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Initialize modals
document.addEventListener('DOMContentLoaded', function() {
    // Close modal on X click
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                hideModal(modal.id);
            }
        });
    });

    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideModal(this.id);
            }
        });
    });

    // Initialize call buttons (call both numbers)
    initCallButtons();
});

// ============================================
// Call Buttons Functionality
// ============================================
function initCallButtons() {
    const callButtons = document.querySelectorAll('#callNowBtn, #floatingCallBtn');
    
    callButtons.forEach(btn => {
        if (btn) {
            // Set href to primary number
            btn.setAttribute('href', 'tel:+917947107253');
            
            btn.addEventListener('click', function(e) {
                // On mobile devices, tel: link will work directly
                // On desktop, it may open dialer or show both numbers
                // The href attribute handles the call functionality
            });
        }
    });
    
    // Also update any other call links
    const otherCallLinks = document.querySelectorAll('a[href*="tel:"]');
    otherCallLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes('919876543210')) {
            link.setAttribute('href', 'tel:+917947107253');
        }
    });
}
