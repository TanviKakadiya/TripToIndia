document.addEventListener('DOMContentLoaded', function() {
    // Check login status
    if (typeof fetch !== 'undefined') {
        fetch('check_session.php')
            .then(response => response.json())
            .then(data => {
                const userStatusElements = document.querySelectorAll('.nav-item:contains("Login"), .nav-item:contains("Register")');
                userStatusElements.forEach(element => {
                    if (data.logged_in) {
                        element.innerHTML = `<i class="fas fa-user-circle"></i> ${data.email}`;
                        element.href = '#';
                    } else {
                        element.innerHTML = 'Login/Register';
                        element.href = 'login.html';
                    }
                });
            })
            .catch(error => console.error('Error checking login status:', error));
    }
    
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = menuToggle.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (nav && nav.classList.contains('active') && !nav.contains(event.target) && !menuToggle.contains(event.target)) {
            nav.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Booking Form Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const returnDateField = document.querySelector('.return-date');
    
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Show/hide return date field based on selected tab
                if (returnDateField) {
                    if (this.dataset.tab === 'one-way' || this.dataset.tab === 'multi-city') {
                        returnDateField.style.display = 'none';
                    } else {
                        returnDateField.style.display = 'block';
                    }
                }
            });
        });
    }
    
    // Origin-Destination Swap
    const swapIcon = document.querySelector('.swap-icon');
    
    if (swapIcon) {
        swapIcon.addEventListener('click', function() {
            const fromInput = document.getElementById('from') || document.getElementById('from-station') || document.getElementById('pickup-location');
            const toInput = document.getElementById('to') || document.getElementById('to-station') || document.getElementById('dropoff-location');
            
            if (fromInput && toInput) {
                const temp = fromInput.value;
                fromInput.value = toInput.value;
                toInput.value = temp;
            }
        });
    }
    
    // Form Validation
    const flightForm = document.getElementById('flight-form');
    const trainForm = document.getElementById('train-form');
    const carForm = document.getElementById('car-form');
    
    const validateForm = function(form) {
        if (!form) return;
        
        form.addEventListener('submit', function(event) {
            let isValid = true;
            const inputs = form.querySelectorAll('input[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    
                    // Add error message if it doesn't exist
                    let errorMsg = input.parentElement.querySelector('.error-message');
                    if (!errorMsg) {
                        errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = 'This field is required';
                        input.parentElement.appendChild(errorMsg);
                    }
                } else {
                    input.classList.remove('error');
                    const errorMsg = input.parentElement.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            });
            
            // Date validation for round trips
            if (isValid && (form.id === 'flight-form' || form.id === 'train-form')) {
                const departureDate = form.querySelector('#departure') || form.querySelector('#journey-date');
                const returnDate = form.querySelector('#return') || form.querySelector('#return-date');
                
                if (departureDate && returnDate && returnDate.style.display !== 'none' && returnDate.value) {
                    if (new Date(departureDate.value) > new Date(returnDate.value)) {
                        isValid = false;
                        alert('Return date cannot be earlier than departure date');
                    }
                }
            }
            
            // Car rental date validation
            if (isValid && form.id === 'car-form') {
                const pickupDate = form.querySelector('#pickup-date');
                const dropoffDate = form.querySelector('#dropoff-date');
                
                if (pickupDate && dropoffDate) {
                    if (new Date(pickupDate.value) > new Date(dropoffDate.value)) {
                        isValid = false;
                        alert('Drop-off date cannot be earlier than pickup date');
                    }
                }
            }
            
            if (!isValid) {
                event.preventDefault();
            }
        });
        
        // Remove error styling on input
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('error');
                const errorMsg = this.parentElement.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            });
        });
    };
    
    validateForm(flightForm);
    validateForm(trainForm);
    validateForm(carForm);
    
    // Deal, Route, and Car Cards Click Events
    const dealBtns = document.querySelectorAll('.deal-btn, .route-btn, .car-btn, .luxury-btn, .trip-btn');
    
    dealBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            window.location.href = 'booking.html';
        });
    });
    
    // Current Date Setup for Date Inputs
    const dateInputs = document.querySelectorAll('input[type="date"]');
    
    if (dateInputs.length > 0) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        
        dateInputs.forEach(input => {
            input.setAttribute('min', formatDate(today));
            
            // Set default values
            if (input.id === 'departure' || input.id === 'journey-date' || input.id === 'pickup-date') {
                input.value = formatDate(today);
            } else if (input.id === 'return' || input.id === 'return-date' || input.id === 'dropoff-date') {
                input.value = formatDate(tomorrow);
            }
        });
    }
    
    // Time Inputs Default Values
    const timeInputs = document.querySelectorAll('input[type="time"]');
    
    if (timeInputs.length > 0) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const currentTime = `${hours}:${minutes}`;
        
        timeInputs.forEach(input => {
            input.value = currentTime;
        });
    }
    
    // Destination Modal Functionality
    const modalBtns = document.querySelectorAll('[data-destination]');
    const modals = document.querySelectorAll('.destination-modal');
    const closeBtns = document.querySelectorAll('.destination-close');
    
    if (modalBtns.length > 0) {
        modalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const destination = this.getAttribute('data-destination');
                const modal = document.getElementById(`${destination}-modal`);
                
                if (modal) {
                    modal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        closeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.destination-modal');
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        });
        
        window.addEventListener('click', function(event) {
            modals.forEach(modal => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        });
    }
});