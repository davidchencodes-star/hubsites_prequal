# Prequal Application V2

A modern prequal (pre-qualification) application form built with Next.js 15.5.4, React 19, TypeScript, and Tailwind CSS 4.

## Overview

This project is a Next.js conversion of the legacy PHP-based `client_prequal` application. It provides a streamlined pre-qualification form for automotive financing with modern UI/UX, real-time validation, and seamless integration capabilities.

## Tech Stack

- **Framework**: Next.js 15.5.4
- **Language**: TypeScript 5
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form 7.63.0
- **Validation**: Zod 4.1.11
- **State Management**: Zustand 5.0.8
- **UI Components**: Radix UI
- **Animations**: Framer Motion 12.23.22
- **Icons**: Lucide React 0.544.0
- **Security**: reCAPTCHA v3
- **Notifications**: React Toastify 11.0.5

## Features

- ✅ **Personal Information Collection**
  - First Name, Middle Initial, Last Name, Suffix
  
- ✅ **Residential Information**
  - Address, ZIP code with auto-decode
  - City and State auto-population
  - Home Phone, Cell Phone, Email

- ✅ **ZIP Code Decoder**
  - Automatic city/state lookup
  - Multiple results selection modal
  - Integration with backend API

- ✅ **Privacy & Terms**
  - Privacy Notice modal
  - Terms and Conditions modal
  - Dynamic content loading with dealer information

- ✅ **Form Validation**
  - Real-time field validation
  - Phone number format validation
  - Email format validation
  - Required field indicators

- ✅ **Security**
  - Google reCAPTCHA v3 integration
  - Score-based verification
  - CSRF protection

- ✅ **Success Page**
  - Customizable success message
  - Optional dealer logo display
  - View inventory button
  - Dealer contact information

- ✅ **Responsive Design**
  - Mobile-first approach
  - Tablet and desktop optimized
  - Touch-friendly UI

- ✅ **Theming**
  - Configurable primary color
  - Custom button styling
  - Border radius and width customization
  - Hover state customization

## Project Structure

```
hubsites_prequal/
├── public/
│   ├── img/                    # Images and assets
│   │   └── favicon.png
│   ├── pages/                  # HTML content pages
│   │   ├── adf.xml            # ADF XML email template
│   │   ├── contact.html       # Contact email template
│   │   ├── privacy.html       # Privacy notice
│   │   └── terms.html         # Terms and conditions
│   └── info.json              # App metadata
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── data/          # Data fetching endpoint
│   │   │   ├── page/          # Page content endpoint
│   │   │   ├── submit/        # Form submission endpoint
│   │   │   └── zipcode/       # ZIP code decoder endpoint
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   └── select.tsx
│   │   ├── FormProvider.tsx   # Form context provider
│   │   ├── LoadingSpinner.tsx # Loading state
│   │   ├── NotFound.tsx       # 404 page
│   │   ├── PrequalForm.tsx    # Main form component
│   │   ├── SuccessPage.tsx    # Success message
│   │   └── ZipCodeSelectionModal.tsx
│   ├── hooks/
│   │   └── useDataFetching.ts # Data fetching hook
│   ├── lib/
│   │   ├── formHelpers.ts     # Form utility functions
│   │   ├── logger.ts          # Debug logging
│   │   ├── schemas.ts         # Zod validation schemas
│   │   ├── store.ts           # Zustand state management
│   │   └── utils.ts           # General utilities
│   └── middleware.ts          # Next.js middleware
├── .env.example               # Environment variables template
├── eslint.config.mjs          # ESLint configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies
├── postcss.config.mjs         # PostCSS configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hubsites_prequal
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure environment variables:
```env
SITE_URL=http://localhost:3000
API_BASE_URL=https://your-api-endpoint.com
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
POSTMARK_TOKEN=your_postmark_server_token
DEBUG_ENABLED=true
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:

```bash
npm run build
# or
yarn build
```

### Start Production Server

```bash
npm start
# or
yarn start
```

## Configuration

### URL Parameters

The application accepts the following URL parameters for customization:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `id` | Dealer/Configuration ID (required) | - |
| `deployType` | Deployment type | - |
| `primaryColor` | Primary theme color | `#d8534e` |
| `successPageEnabled` | Enable custom success page | `false` |
| `successLogo` | Success page logo URL | - |
| `dealerLoc` | Dealer location | - |
| `btnType` | Button styling type (`standard` or `styled`) | `standard` |
| `borderRadius` | Button border radius | `4px` |
| `borderWidth` | Button border width | `2px` |
| `borderColor` | Button border color | `#000000` |
| `color` | Button text color | `#ffffff` |
| `bgColor` | Button background color | `rgba(0,0,0,1)` |
| `hColor` | Hover text color | `#ffffff` |
| `hBorderC` | Hover border color | `#000000` |
| `bgHColor` | Hover background color | `#000000` |
| `opacity` | Hover opacity | `1` |
| `thickness` | Text shadow thickness | `2` |

Example URL:
```
http://localhost:3000?id=123&primaryColor=%23d8534e&successPageEnabled=true
```

## API Endpoints

### POST /api/data
Fetch dealer and configuration data.

**Request:**
```json
{
  "id": "dealer-id",
  "deployType": "type",
  "parentDomain": "domain",
  "parentIP": "ip"
}
```

### POST /api/zipcode
Decode ZIP code to city/state.

**Request:**
```json
{
  "id": "token",
  "zip": "12345"
}
```

### POST /api/submit
Submit prequal form.

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  // ... other fields
  "recaptcha": "token"
}
```

### POST /api/page
Load privacy/terms content.

**Request:**
```json
{
  "page": "privacy.html",
  "name": "Dealer Name",
  "phone": "1234567890",
  "email": "dealer@example.com"
}
```

## Validation Rules

- **First Name**: Required, minimum 1 character
- **Last Name**: Required, minimum 1 character
- **Address**: Required, minimum 1 character
- **ZIP Code**: Required, must be valid 5-digit or 5+4 format
- **City**: Required, minimum 1 character
- **State**: Required, minimum 1 character
- **Cell Phone**: Required, must be 10 digits
- **Home Phone**: Optional, must be 10 digits if provided
- **Email**: Required, must be valid email format
- **Agreement Checkbox**: Required, must be checked

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## iframe Integration

The application is designed to work within an iframe and communicates with the parent window:

- **Resize Messages**: Sends `resize::{height}` to parent for dynamic sizing
- **Submit Messages**: Sends `submitted::` on form submission
- **Inventory Messages**: Sends `viewInventory::` when viewing inventory

## Development Notes

### Debugging

Enable debug mode in `.env.local`:
```env
DEBUG_ENABLED=true
```

This will enable console logging for:
- Form errors
- API responses
- State changes

### Code Quality

Run linting:
```bash
npm run lint
# or
yarn lint
```

Fix linting issues:
```bash
npm run lint:fix
# or
yarn lint:fix
```

## Migration from PHP Version

This project replaces the legacy `client_prequal` PHP application with the following improvements:

1. **Modern Stack**: Uses Next.js, React, and TypeScript instead of PHP and jQuery
2. **Type Safety**: Full TypeScript implementation with Zod validation
3. **Better UX**: Real-time validation, loading states, and animations
4. **State Management**: Centralized state with Zustand
5. **Component Architecture**: Modular, reusable components
6. **Security**: Modern reCAPTCHA v3 implementation
7. **Performance**: Server-side rendering and optimized bundle
8. **Maintainability**: Clear code structure and documentation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and tests
5. Submit a pull request

## License

[Specify your license here]

## Support

For support, please contact [support@getmyauto.com](mailto:support@getmyauto.com)

## Version History

### 1.0.0 (Initial Release)
- Complete conversion from PHP to Next.js
- All legacy features implemented
- Modern UI/UX improvements
- Enhanced security with reCAPTCHA v3
- Responsive design for all devices
