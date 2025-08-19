# Profit Calculator - Angular Frontend

A modern Angular application for managing shipment profit calculations. This application allows users to create shipments, add income and cost calculations, and view profit/loss analysis with a clean, responsive interface.

## 🚀 Features

- **Shipment Management**: Create and manage shipments
- **Profit Calculations**: Add income and cost entries for each shipment
- **Real-time Validation**: Input validation with user-friendly error messages
- **Responsive Design**: Modern UI built with Angular Material
- **Error Handling**: Comprehensive error handling with user feedback
- **Loading States**: Visual feedback during API operations
- **Search & Filter**: Filter calculations by ID
- **Sorting & Pagination**: Advanced table features for data management

## 🛠️ Technology Stack

- **Framework**: Angular 17 (Standalone Components)
- **UI Library**: Angular Material
- **Styling**: CSS with Material Design theming
- **Testing**: Jasmine + Karma
- **HTTP Client**: Angular HttpClient with RxJS
- **State Management**: Reactive programming with Observables

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Angular CLI** (version 17 or higher)

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd front-end
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

## 🏗️ Project Structure

```
src/
├── app/
│   ├── common/                    # Shared components
│   │   └── colored-text.component.ts
│   ├── components/                # Feature components
│   │   └── shipments/
│   │       ├── shipment-detail.component.ts
│   │       └── shipments-list.component.ts
│   ├── models/                    # Data models
│   │   ├── calculation.model.ts
│   │   └── shipment.model.ts
│   ├── services/                  # Business logic services
│   │   ├── calculation.service.ts
│   │   ├── shipment.service.ts
│   │   ├── validation.service.ts
│   │   └── notification.service.ts
│   ├── app.component.ts           # Root component
│   ├── app.routes.ts              # Application routing
│   └── app.service.ts             # Navigation service
├── assets/                        # Static assets
└── styles.css                     # Global styles
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --code-coverage

# Run tests in watch mode
npm test -- --watch
```

### Test Coverage
The application includes comprehensive unit tests for:
- **Services**: HTTP operations, validation logic, notifications
- **Components**: User interactions, data binding, lifecycle hooks
- **Models**: Data structure validation

## 🔧 Development

### Available Scripts

```bash
# Development server
npm start

# Production build
npm run build

# Build with watch mode
npm run watch

# Run tests
npm test

# Lint code
npm run lint
```

### Code Quality

The project follows Angular best practices:
- **SOLID Principles**: Proper separation of concerns
- **TypeScript**: Strong typing throughout
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent code formatting

## 📱 Usage

### Navigation
1. **Home Page**: Lists all shipments
2. **Shipment Details**: Click on any shipment to view calculations
3. **Add Shipment**: Use the "Add Shipment" button to create new shipments
4. **Add Calculation**: In shipment details, enter income and cost values

### Features
- **Input Validation**: Real-time validation with helpful error messages
- **Loading Indicators**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on desktop and mobile devices

## 🔒 Error Handling

The application implements comprehensive error handling:

### HTTP Errors
- **Network Errors**: Automatic retry for GET requests
- **Server Errors**: User-friendly error messages
- **Validation Errors**: Form-level validation with specific feedback

### User Feedback
- **Success Messages**: Confirmation for successful operations
- **Warning Messages**: Validation warnings and business rule violations
- **Error Messages**: Clear error descriptions with actionable information

## 🎨 UI/UX Features

### Material Design
- **Consistent Theming**: Material Design color palette
- **Responsive Layout**: Adaptive design for different screen sizes
- **Accessibility**: ARIA labels and keyboard navigation
- **Loading States**: Spinners and disabled states during operations

### User Experience
- **Intuitive Navigation**: Clear breadcrumbs and navigation
- **Visual Feedback**: Color-coded profit/loss values
- **Form Validation**: Real-time validation with inline errors
- **Empty States**: Helpful messages when no data is available

## 🔧 Configuration

### Environment Variables
The application uses the following configuration:

```typescript
// API Configuration
private baseUrl = '/api/profit/shipments';

// Validation Rules
const MAX_AMOUNT = 1000000; // Maximum income/cost amount
```

### Proxy Configuration
For development, the application uses a proxy to forward API requests:

```json
// proxy.conf.json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

The build artifacts will be stored in the `dist/front-end/` directory.

### Deployment Options
- **Static Hosting**: Deploy to Netlify, Vercel, or similar
- **Docker**: Containerize the application
- **CDN**: Serve static files from a CDN

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0**: Initial release with basic CRUD operations
- **v1.1.0**: Added comprehensive error handling and validation
- **v1.2.0**: Enhanced UI/UX with loading states and notifications
- **v1.3.0**: Added unit tests and improved documentation
