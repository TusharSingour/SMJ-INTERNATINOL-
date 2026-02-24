# Hotel SMJ International - Booking Web App

A fully functional, modern, responsive hotel booking web application for Hotel SMJ International located in Mandla, Madhya Pradesh, India.

## Features

- 🏨 **Luxury Design** - Premium UI with gold, dark blue, and white color scheme
- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- 🛏️ **Room Booking System** - Book Deluxe, Super Deluxe, and Family Suite rooms
- 🔐 **Admin Panel** - Secure login and booking management dashboard
- 💬 **WhatsApp Integration** - Direct booking via WhatsApp
- 📍 **Google Maps** - Location integration
- 📞 **Call Button** - Quick contact option
- ✨ **Smooth Animations** - Modern UI animations and transitions
- 🔥 **Firebase Integration** - Real-time database and authentication

## Tech Stack

- HTML5
- CSS3 (Modern UI with gradients and animations)
- JavaScript (Vanilla JS)
- Firebase (Authentication + Realtime Database)

## Project Structure

```
hotel-booking-app/
├── index.html          # Home page
├── rooms.html          # Rooms listing page
├── booking.html        # Booking form page
├── admin.html          # Admin panel
├── css/
│   └── style.css      # Main stylesheet
├── js/
│   ├── firebase-config.js  # Firebase configuration
│   ├── main.js         # General functionality
│   ├── booking.js      # Booking form handling
│   └── admin.js        # Admin panel functionality
└── README.md           # This file
```

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable **Email/Password** provider
4. Enable **Realtime Database**:
   - Go to Realtime Database
   - Create database in **test mode** (for development)
   - Copy the database URL
5. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click on the web icon (</>)
   - Copy the Firebase configuration object

### 2. Configure Firebase

Open `js/firebase-config.js` and replace the placeholder values with your Firebase credentials:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 3. Create Admin User

1. Go to Firebase Console > Authentication
2. Click "Add user"
3. Enter email and password for admin access
4. Use these credentials to login to the admin panel

### 4. Database Rules (Optional - for production)

For production, update your Realtime Database rules:

```json
{
  "rules": {
    "bookings": {
      ".read": "auth != null",
      ".write": true
    }
  }
}
```

### 5. Run the Application

#### Option 1: Local Server (Recommended)

Use a local development server:

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

#### Option 2: Direct File Opening

Simply open `index.html` in your browser (some features may not work due to CORS).

#### Option 3: GitHub Pages

1. Push your code to a GitHub repository
2. Go to Settings > Pages
3. Select your branch and folder
4. Your site will be live at `https://yourusername.github.io/repository-name`

#### Option 4: Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## Pages

### 1. Home Page (`index.html`)
- Hero section with hotel image
- About section
- Services section
- Room preview cards
- Gallery section
- Contact section with Google Maps

### 2. Rooms Page (`rooms.html`)
- Detailed information about each room type:
  - Deluxe Room (₹2,500/night)
  - Super Deluxe Room (₹3,500/night)
  - Family Suite (₹5,000/night)
- Facilities for each room
- Direct booking links

### 3. Booking Page (`booking.html`)
- Booking form with validation
- Real-time booking summary
- Date validation
- Success confirmation modal

### 4. Admin Panel (`admin.html`)
- Secure email/password login
- Dashboard with statistics
- View all bookings in a table
- Delete booking functionality
- Logout option

## Features Details

### Booking System
- Form validation (name, email, phone, dates, room type)
- Automatic price calculation
- Night calculation
- Firebase database storage
- Success confirmation

### Admin Panel
- Firebase Authentication
- Real-time booking updates
- Statistics dashboard
- Booking management (view/delete)
- Responsive table design

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile
- Flexible grid layouts
- Touch-friendly buttons
- Optimized images

### Extra Features
- WhatsApp floating button
- Call button
- Google Maps integration
- Loading animations
- Smooth scroll
- Form validation
- Error handling

## Customization

### Change Colors
Edit CSS variables in `css/style.css`:

```css
:root {
    --primary-gold: #D4AF37;
    --dark-blue: #1a2332;
    /* ... */
}
```

### Change Room Prices
Edit prices in `js/booking.js`:

```javascript
function getRoomPrice(roomType) {
    const prices = {
        'deluxe': 2500,
        'super-deluxe': 3500,
        'family-suite': 5000
    };
    return prices[roomType] || 0;
}
```

### Change Contact Information
Update contact details in:
- `index.html` (contact section)
- `index.html` (footer)
- `js/main.js` (WhatsApp and call buttons)

### Add Real Images
Replace placeholder divs with actual images:

```html
<!-- Instead of -->
<div class="image-placeholder">Image</div>

<!-- Use -->
<img src="path/to/image.jpg" alt="Description">
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Firebase Not Working
- Check if Firebase config is correctly set in `js/firebase-config.js`
- Verify Firebase services are enabled in Firebase Console
- Check browser console for errors

### Admin Login Not Working
- Ensure Email/Password authentication is enabled in Firebase
- Verify admin user exists in Firebase Authentication
- Check browser console for error messages

### Bookings Not Saving
- Verify Realtime Database is enabled
- Check database rules allow writes
- Ensure Firebase config is correct

## License

This project is open source and available for use.

## Support

For issues or questions, please contact:
- Email: info@hotelsmjinternational.com
- Phone: +91 98765 43210

---

**Hotel SMJ International** - Luxury Stay in Mandla, Madhya Pradesh, India
