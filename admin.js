// Admin Panel JavaScript
// Handles admin authentication and booking management

// Check authentication state on load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthState();
    initAdminLogin();
    initLogout();
    initRefreshButton();
    initDeleteModal();
});

// ============================================
// Check Authentication State
// ============================================
function checkAuthState() {
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            showDashboard(user);
        } else {
            // User is signed out
            showLogin();
        }
    });
}

// ============================================
// Show Login Section
// ============================================
function showLogin() {
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    
    if (loginSection) loginSection.style.display = 'block';
    if (dashboardSection) dashboardSection.style.display = 'none';
}

// ============================================
// Show Dashboard
// ============================================
function showDashboard(user) {
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const adminUserEmail = document.getElementById('adminUserEmail');
    
    if (loginSection) loginSection.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'block';
    if (adminUserEmail) adminUserEmail.textContent = user.email;
    
    // Load bookings
    loadBookings();
}

// ============================================
// Initialize Admin Login
// ============================================
function initAdminLogin() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
}

// ============================================
// Handle Admin Login
// ============================================
function handleAdminLogin(e) {
    e.preventDefault();
    
    // Clear errors
    clearError('loginEmailError');
    clearError('loginPasswordError');
    clearError('loginError');
    
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    
    // Validate
    if (!email) {
        showError('loginEmailError', 'Email is required');
        return;
    }
    
    if (!validateEmail(email)) {
        showError('loginEmailError', 'Please enter a valid email');
        return;
    }
    
    if (!password) {
        showError('loginPasswordError', 'Password is required');
        return;
    }
    
    // Show loading state
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoader = loginBtn.querySelector('.btn-loader');
    
    loginBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    
    // Sign in with Firebase
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Success - handled by auth state change
        })
        .catch((error) => {
            console.error('Login error:', error);
            
            // Reset button state
            loginBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            
            // Show error
            let errorMessage = 'Login failed. Please check your credentials.';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This account has been disabled.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Please try again later.';
                    break;
            }
            
            showError('loginError', errorMessage);
        });
}

// ============================================
// Initialize Logout
// ============================================
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                auth.signOut()
                    .then(() => {
                        // Success - handled by auth state change
                    })
                    .catch((error) => {
                        console.error('Logout error:', error);
                        alert('Error logging out. Please try again.');
                    });
            }
        });
    }
}

// ============================================
// Load Bookings
// ============================================
function loadBookings() {
    const bookingsTableBody = document.getElementById('bookingsTableBody');
    
    if (!bookingsTableBody) return;
    
    bookingsTableBody.innerHTML = '<tr><td colspan="11" class="no-data">Loading bookings...</td></tr>';
    
    try {
        const bookingsRef = database.ref('bookings');
        
        bookingsRef.on('value', (snapshot) => {
            const bookings = snapshot.val();
            
            if (!bookings || Object.keys(bookings).length === 0) {
                bookingsTableBody.innerHTML = '<tr><td colspan="11" class="no-data">No bookings found</td></tr>';
                updateStats({});
                return;
            }
            
            // Convert to array and sort by date
            const bookingsArray = Object.entries(bookings).map(([key, value]) => ({
                id: key,
                ...value
            })).sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            
            // Update table
            displayBookings(bookingsArray);
            
            // Update stats
            updateStats(bookings);
        }, (error) => {
            console.error('Error loading bookings:', error);
            bookingsTableBody.innerHTML = '<tr><td colspan="11" class="no-data">Error loading bookings. Please refresh.</td></tr>';
        });
    } catch (error) {
        console.error('Firebase error:', error);
        bookingsTableBody.innerHTML = '<tr><td colspan="11" class="no-data">Firebase is not configured. Please configure Firebase in firebase-config.js</td></tr>';
    }
}

// ============================================
// Display Bookings in Table
// ============================================
function displayBookings(bookings) {
    const bookingsTableBody = document.getElementById('bookingsTableBody');
    
    if (!bookingsTableBody) return;
    
    if (bookings.length === 0) {
        bookingsTableBody.innerHTML = '<tr><td colspan="11" class="no-data">No bookings found</td></tr>';
        return;
    }
    
    bookingsTableBody.innerHTML = bookings.map(booking => {
        const checkinDate = formatDate(booking.checkin);
        const checkoutDate = formatDate(booking.checkout);
        const createdAt = new Date(booking.createdAt).toLocaleString('en-IN');
        const totalAmount = formatCurrency(booking.totalAmount || 0);
        
        return `
            <tr>
                <td>${booking.bookingId || booking.id.substring(0, 8)}</td>
                <td>${booking.name}</td>
                <td>${booking.email}</td>
                <td>${booking.phone}</td>
                <td>${booking.roomName || booking.roomType}</td>
                <td>${checkinDate}</td>
                <td>${checkoutDate}</td>
                <td>${booking.guests || '-'}</td>
                <td>${totalAmount}</td>
                <td>${createdAt}</td>
                <td>
                    <button class="action-btn" onclick="confirmDeleteBooking('${booking.id}')">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

// ============================================
// Update Statistics
// ============================================
function updateStats(bookings) {
    const bookingsArray = Object.values(bookings);
    const totalBookings = bookingsArray.length;
    const pendingBookings = bookingsArray.filter(b => b.status === 'pending').length;
    const totalRevenue = bookingsArray.reduce((sum, booking) => {
        return sum + (booking.totalAmount || 0);
    }, 0);
    
    const totalBookingsEl = document.getElementById('totalBookings');
    const pendingBookingsEl = document.getElementById('pendingBookings');
    const totalRevenueEl = document.getElementById('totalRevenue');
    
    if (totalBookingsEl) totalBookingsEl.textContent = totalBookings;
    if (pendingBookingsEl) pendingBookingsEl.textContent = pendingBookings;
    if (totalRevenueEl) totalRevenueEl.textContent = formatCurrency(totalRevenue);
}

// ============================================
// Initialize Refresh Button
// ============================================
function initRefreshButton() {
    const refreshBtn = document.getElementById('refreshBtn');
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadBookings();
        });
    }
}

// ============================================
// Initialize Delete Modal
// ============================================
let currentDeleteId = null;

function initDeleteModal() {
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            if (currentDeleteId) {
                deleteBooking(currentDeleteId);
            }
        });
    }
    
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            hideModal('deleteModal');
            currentDeleteId = null;
        });
    }
}

// ============================================
// Confirm Delete Booking
// ============================================
function confirmDeleteBooking(bookingId) {
    try {
        const bookingRef = database.ref('bookings/' + bookingId);
        
        bookingRef.once('value', (snapshot) => {
            const booking = snapshot.val();
            
            if (booking) {
                currentDeleteId = bookingId;
                
                const deleteBookingInfo = document.getElementById('deleteBookingInfo');
                if (deleteBookingInfo) {
                    deleteBookingInfo.innerHTML = `
                        <strong>Name:</strong> ${booking.name}<br>
                        <strong>Email:</strong> ${booking.email}<br>
                        <strong>Room:</strong> ${booking.roomName || booking.roomType}<br>
                        <strong>Check-in:</strong> ${formatDate(booking.checkin)}<br>
                        <strong>Amount:</strong> ${formatCurrency(booking.totalAmount || 0)}
                    `;
                }
                
                showModal('deleteModal');
            }
        });
    } catch (error) {
        console.error('Error loading booking:', error);
        alert('Error loading booking details.');
    }
}

// ============================================
// Delete Booking
// ============================================
function deleteBooking(bookingId) {
    try {
        const bookingRef = database.ref('bookings/' + bookingId);
        
        bookingRef.remove()
            .then(() => {
                hideModal('deleteModal');
                currentDeleteId = null;
                // Bookings will automatically refresh via the listener
            })
            .catch((error) => {
                console.error('Error deleting booking:', error);
                alert('Error deleting booking. Please try again.');
            });
    } catch (error) {
        console.error('Firebase error:', error);
        alert('Firebase is not configured. Please configure Firebase in firebase-config.js');
    }
}

// Make confirmDeleteBooking available globally
window.confirmDeleteBooking = confirmDeleteBooking;
