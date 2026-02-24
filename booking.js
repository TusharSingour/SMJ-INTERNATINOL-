// Booking JavaScript
// Handles booking form submission and validation

document.addEventListener('DOMContentLoaded', function() {
    initBookingForm();
    initBookingSummary();
    checkRoomParameter();
});

// ============================================
// Initialize Booking Form
// ============================================
function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        const checkinInput = document.getElementById('checkin');
        const checkoutInput = document.getElementById('checkout');
        
        if (checkinInput) {
            checkinInput.setAttribute('min', today);
            checkinInput.addEventListener('change', function() {
                if (checkoutInput) {
                    const checkinDate = new Date(this.value);
                    checkinDate.setDate(checkinDate.getDate() + 1);
                    checkoutInput.setAttribute('min', checkinDate.toISOString().split('T')[0]);
                }
                updateBookingSummary();
            });
        }
        
        if (checkoutInput) {
            checkoutInput.addEventListener('change', updateBookingSummary);
        }
        
        // Real-time validation
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        const roomTypeInput = document.getElementById('roomType');
        const guestsInput = document.getElementById('guests');
        
        if (nameInput) {
            nameInput.addEventListener('blur', function() {
                validateName(this.value);
            });
        }
        
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '');
            });
            phoneInput.addEventListener('blur', function() {
                validatePhoneNumber(this.value);
            });
        }
        
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                validateEmailAddress(this.value);
            });
        }
        
        if (roomTypeInput) {
            roomTypeInput.addEventListener('change', updateBookingSummary);
        }
        
        if (guestsInput) {
            guestsInput.addEventListener('change', updateBookingSummary);
        }
        
        // Form submission
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
}

// ============================================
// Check Room Parameter from URL
// ============================================
function checkRoomParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    const roomType = urlParams.get('room');
    
    if (roomType) {
        const roomTypeSelect = document.getElementById('roomType');
        if (roomTypeSelect) {
            roomTypeSelect.value = roomType;
            updateBookingSummary();
        }
    }
}

// ============================================
// Initialize Booking Summary
// ============================================
function initBookingSummary() {
    updateBookingSummary();
}

// ============================================
// Update Booking Summary
// ============================================
function updateBookingSummary() {
    const roomType = document.getElementById('roomType')?.value;
    const checkin = document.getElementById('checkin')?.value;
    const checkout = document.getElementById('checkout')?.value;
    const guests = document.getElementById('guests')?.value || 1;
    
    // Update room type
    const summaryRoom = document.getElementById('summaryRoom');
    if (summaryRoom) {
        summaryRoom.textContent = roomType ? getRoomName(roomType) : '-';
    }
    
    // Update dates
    const summaryCheckin = document.getElementById('summaryCheckin');
    if (summaryCheckin) {
        summaryCheckin.textContent = checkin ? formatDate(checkin) : '-';
    }
    
    const summaryCheckout = document.getElementById('summaryCheckout');
    if (summaryCheckout) {
        summaryCheckout.textContent = checkout ? formatDate(checkout) : '-';
    }
    
    // Update guests
    const summaryGuests = document.getElementById('summaryGuests');
    if (summaryGuests) {
        summaryGuests.textContent = guests || '-';
    }
    
    // Calculate nights and total
    if (checkin && checkout && roomType) {
        const nights = calculateNights(checkin, checkout);
        const pricePerNight = getRoomPrice(roomType);
        const total = nights * pricePerNight;
        
        const summaryNights = document.getElementById('summaryNights');
        if (summaryNights) {
            summaryNights.textContent = nights;
        }
        
        const summaryTotal = document.getElementById('summaryTotal');
        if (summaryTotal) {
            summaryTotal.textContent = formatCurrency(total);
        }
    } else {
        const summaryNights = document.getElementById('summaryNights');
        if (summaryNights) {
            summaryNights.textContent = '-';
        }
        
        const summaryTotal = document.getElementById('summaryTotal');
        if (summaryTotal) {
            summaryTotal.textContent = '₹0';
        }
    }
}

// ============================================
// Form Validation
// ============================================
function validateName(name) {
    clearError('nameError');
    
    if (!name || name.trim() === '') {
        showError('nameError', 'Name is required');
        return false;
    }
    
    if (name.trim().length < 2) {
        showError('nameError', 'Name must be at least 2 characters');
        return false;
    }
    
    return true;
}

function validatePhoneNumber(phone) {
    clearError('phoneError');
    
    if (!phone || phone.trim() === '') {
        showError('phoneError', 'Phone number is required');
        return false;
    }
    
    const cleanedPhone = phone.replace(/\D/g, '');
    
    if (cleanedPhone.length !== 10) {
        showError('phoneError', 'Please enter a valid 10-digit phone number');
        return false;
    }
    
    if (!validatePhone(cleanedPhone)) {
        showError('phoneError', 'Please enter a valid Indian phone number');
        return false;
    }
    
    return true;
}

function validateEmailAddress(email) {
    clearError('emailError');
    
    if (!email || email.trim() === '') {
        showError('emailError', 'Email is required');
        return false;
    }
    
    if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        return false;
    }
    
    return true;
}

function validateDatesInput() {
    clearError('checkinError');
    clearError('checkoutError');
    
    const checkin = document.getElementById('checkin')?.value;
    const checkout = document.getElementById('checkout')?.value;
    
    if (!checkin) {
        showError('checkinError', 'Check-in date is required');
        return false;
    }
    
    if (!checkout) {
        showError('checkoutError', 'Check-out date is required');
        return false;
    }
    
    const dateValidation = validateDates(checkin, checkout);
    if (!dateValidation.valid) {
        showError('checkoutError', dateValidation.message);
        return false;
    }
    
    return true;
}

function validateRoomType() {
    clearError('roomTypeError');
    
    const roomType = document.getElementById('roomType')?.value;
    
    if (!roomType) {
        showError('roomTypeError', 'Please select a room type');
        return false;
    }
    
    return true;
}

function validateGuests() {
    clearError('guestsError');
    
    const guests = document.getElementById('guests')?.value;
    
    if (!guests || guests < 1) {
        showError('guestsError', 'Please enter number of guests');
        return false;
    }
    
    if (guests > 10) {
        showError('guestsError', 'Maximum 10 guests allowed');
        return false;
    }
    
    return true;
}

// ============================================
// Handle Booking Submit
// ============================================
function handleBookingSubmit(e) {
    e.preventDefault();
    
    // Clear all errors
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const roomType = document.getElementById('roomType').value;
    const guests = document.getElementById('guests').value;
    const specialRequests = document.getElementById('specialRequests').value.trim();
    
    // Validate all fields
    let isValid = true;
    
    if (!validateName(name)) isValid = false;
    if (!validatePhoneNumber(phone)) isValid = false;
    if (!validateEmailAddress(email)) isValid = false;
    if (!validateDatesInput()) isValid = false;
    if (!validateRoomType()) isValid = false;
    if (!validateGuests()) isValid = false;
    
    if (!isValid) {
        return;
    }
    
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    
    // Calculate booking details
    const nights = calculateNights(checkin, checkout);
    const pricePerNight = getRoomPrice(roomType);
    const totalAmount = nights * pricePerNight;
    
    // Create booking object
    const bookingData = {
        name: name,
        phone: phone.replace(/\D/g, ''),
        email: email,
        checkin: checkin,
        checkout: checkout,
        roomType: roomType,
        roomName: getRoomName(roomType),
        guests: parseInt(guests),
        nights: nights,
        pricePerNight: pricePerNight,
        totalAmount: totalAmount,
        specialRequests: specialRequests || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
        bookingId: generateBookingId()
    };
    
    // Save to Firebase
    saveBookingToFirebase(bookingData);
}

// ============================================
// Save Booking to Firebase
// ============================================
function saveBookingToFirebase(bookingData) {
    try {
        const bookingsRef = database.ref('bookings');
        const newBookingRef = bookingsRef.push();
        
        newBookingRef.set(bookingData)
            .then(() => {
                // Success
                showSuccessModal();
                document.getElementById('bookingForm').reset();
                updateBookingSummary();
            })
            .catch((error) => {
                console.error('Error saving booking:', error);
                alert('An error occurred while saving your booking. Please try again or contact us directly.');
            })
            .finally(() => {
                // Reset button state
                const submitBtn = document.getElementById('submitBtn');
                const btnText = submitBtn.querySelector('.btn-text');
                const btnLoader = submitBtn.querySelector('.btn-loader');
                
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoader.style.display = 'none';
            });
    } catch (error) {
        console.error('Firebase error:', error);
        alert('Firebase is not configured. Please configure Firebase in firebase-config.js');
        
        // Reset button state
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

// ============================================
// Generate Booking ID
// ============================================
function generateBookingId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return 'SMJ' + timestamp + random;
}

// ============================================
// Show Success Modal
// ============================================
function showSuccessModal() {
    showModal('successModal');
}

// Initialize success modal buttons
document.addEventListener('DOMContentLoaded', function() {
    const newBookingBtn = document.getElementById('newBookingBtn');
    if (newBookingBtn) {
        newBookingBtn.addEventListener('click', function() {
            hideModal('successModal');
            document.getElementById('bookingForm').reset();
            updateBookingSummary();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
