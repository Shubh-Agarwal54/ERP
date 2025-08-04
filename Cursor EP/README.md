# ERPDADDY - Product Management System

A modern, responsive ERP (Enterprise Resource Planning) system built with HTML, CSS, and JavaScript for product management and inventory control.

## Features

### 🏢 **Header Section**
- **ERPDADDY Logo**: Professional branding with blue color scheme
- **Real-time Clock**: Updates every second showing current time
- **Menu Button**: Blue button for navigation (placeholder functionality)
- **Header Icons**: Chat, notifications, and user profile icons

### 📋 **Category Detail Section**
- **BOM Type**: Dropdown with add functionality
- **Category**: Dropdown with add functionality  
- **Product Type**: Dropdown with add functionality
- **Set Status**: Dropdown for status selection
- **Part Type**: Dropdown for part classification
- **P Status**: Dropdown with search functionality (default: "New")

### 📦 **Product Detail Section**
- **Product Name**: Required text input
- **Prev Alias Code**: Pre-filled with "7458thirth"
- **Alias P.Code**: Required text input
- **MOQ**: Minimum Order Quantity
- **HS Code**: Harmonized System code
- **Color**: Dropdown with "No Color" default and add functionality
- **Custom Description**: Large text area
- **Product Designer**: Dropdown with add functionality
- **Virtual/Actual**: Dropdown (default: "Actual")
- **Hardware BOM**: Dropdown (default: "No")
- **Group/Collection**: Dropdown with add functionality
- **Finish**: Text input
- **Material Description**: Text input
- **Technical Name**: Text input
- **Buyers**: Text input
- **Material**: Text input
- **Suitable for**: Text input with add functionality

### 📏 **Product Dimension Section**
- **Dimension**: Dropdown (default: "CBM")
- **Size Unit**: Dropdown (default: "inch")
- **Length, Width, Height**: Required number inputs
- **Product CBM**: Auto-calculated read-only field
- **CM. WGT. Button**: Orange button for weight calculation
- **Net Weight, Box Gross Weight, Gross Weight**: Number inputs
- **Packaging Type**: Dropdown (default: "Normal")
- **Pack Type**: Dropdown (default: "Box")
- **+ Box Button**: Adds additional box entries

### ✅ **Other Detail Section**
- **Checkbox**: Simple checkbox for additional details

### 🖼️ **Right Sidebar - Image Upload**
- **P.Code Input**: Text input for product code
- **Upload Image Button**: Purple button for image upload
- **Image Container**: Shows "NO IMAGE" with upload icon
- **Paperclip Icon**: Yellow attachment indicator

### 📦 **Right Sidebar - Container/CBM/Loadability**
- **Total CFT**: Auto-calculated from container inputs
- **Container Inputs**: Three container fields with ship icons
- **Remark/Wood Type**: Text area for additional notes

### 💾 **Action Buttons**
- **Set Details**: Green button for auto-filling fields
- **Save**: Blue button for saving product data

### 📄 **Footer**
- **Copyright**: ERPDADDY EXPORTS branding
- **Product By**: ERPDaddy Software Solution credit

## Functionality

### 🔄 **Real-time Features**
- **Live Clock**: Updates every second
- **Auto CBM Calculation**: Calculates cubic feet from dimensions
- **Weight Calculation**: CM. WGT. button estimates weight based on volume
- **Form Validation**: Real-time validation with visual feedback

### ➕ **Add Functionality**
- **Dynamic Dropdowns**: Add new options to any dropdown
- **Box Addition**: Add multiple box entries
- **Image Upload**: Drag and drop or click to upload images

### 🔍 **Search & Validation**
- **Search Button**: Placeholder for product search
- **Required Field Validation**: Ensures all required fields are filled
- **Auto-fill**: Set Details button auto-generates codes

### 💾 **Data Management**
- **Form Data Collection**: Gathers all input data
- **Save Functionality**: Simulates server-side saving
- **Console Logging**: Logs form data for debugging

## Technical Details

### 🛠️ **Technologies Used**
- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Interactive functionality
- **Font Awesome**: Icons for UI elements

### 📱 **Responsive Design**
- **Desktop**: Full layout with sidebar
- **Tablet**: Adjusted grid layouts
- **Mobile**: Stacked layout for mobile devices

### 🎨 **Color Scheme**
- **Primary Blue**: #0066cc (buttons, links)
- **Success Green**: #4CAF50 (Set Details button)
- **Warning Orange**: #ff6600 (CM. WGT. button)
- **Purple**: #8e44ad (Upload button)
- **Yellow**: #ffcc00 (Paperclip icon)

### 🔧 **Browser Compatibility**
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Getting Started

1. **Download Files**: Ensure all three files are in the same directory
   - `index.html`
   - `styles.css`
   - `script.js`

2. **Open in Browser**: Double-click `index.html` or open in your preferred browser

3. **Start Using**: 
   - Fill in required fields (marked with red asterisks)
   - Use the "+" buttons to add new options
   - Upload images using the purple upload button
   - Calculate dimensions and weights automatically
   - Save your product data

## Customization

### 🎨 **Styling**
- Modify `styles.css` to change colors, fonts, or layout
- Update CSS variables for consistent theming
- Adjust responsive breakpoints as needed

### ⚙️ **Functionality**
- Edit `script.js` to add new features
- Modify validation rules
- Add server integration for data persistence
- Implement actual search functionality

### 📝 **Content**
- Update `index.html` to change form fields
- Modify dropdown options
- Add new sections as needed

## File Structure

```
erp-system/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and layout
├── script.js           # JavaScript functionality
└── README.md          # This documentation
```

## Browser Support

The system is designed to work on modern browsers with support for:
- CSS Grid and Flexbox
- ES6 JavaScript features
- File API for image upload
- Local Storage (optional)

## Performance

- **Lightweight**: No external dependencies except Font Awesome CDN
- **Fast Loading**: Optimized CSS and JavaScript
- **Responsive**: Efficient media queries
- **Accessible**: Semantic HTML and ARIA labels

## Future Enhancements

- **Database Integration**: Connect to backend systems
- **User Authentication**: Login/logout functionality
- **Data Export**: PDF/Excel export capabilities
- **Advanced Search**: Full-text search with filters
- **Barcode Scanning**: Product code scanning
- **Multi-language Support**: Internationalization
- **Dark Mode**: Theme switching capability

## Support

For questions or issues:
1. Check browser console for JavaScript errors
2. Ensure all files are in the same directory
3. Verify internet connection for Font Awesome icons
4. Test in different browsers for compatibility

---

**Built with ❤️ for ERPDADDY Software Solutions** 