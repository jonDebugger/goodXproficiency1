# GoodX API Booking System

## Prerequisites

- Node.js (v16 or later)
- npm

## Setup and Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd goodx-booking
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables (if necessary)

   - This application uses a proxy to connect to the GoodX API
   - The proxy is configured in `setupProxy.js` and targets https://dev_interview.qagoodx.co.za

4. Start the development server

   ```bash
   npm start
   ```

5. Build for production
   ```bash
   npm run build
   ```

## Usage

1. Open the application in a web browser (http://localhost:3000 by default)
2. Log in with the provided GoodX credentials
3. Navigate the dashboard to view your bookings
4. Use the provided interface to create, update, or delete bookings

## Technical Details

### Architecture

The application follows a standard React application structure:

- `src/components/`: UI components
- `src/services/`: API service functions
- `src/util/`: Utility functions

### API Integration

This application integrates with the GoodX API, which includes endpoints for:

- Authentication (`/api/session`)
- Fetching diaries (`/api/diary`)
- Managing bookings (`/api/booking`)
- Fetching patients (`/api/patient`)
- Fetching debtors (`/api/debtor`)
- Managing booking types and statuses (`/api/booking_type`, `/api/booking_status`)

### State Management

- React's built-in hooks (useState, useEffect) are used for state management
- API calls are abstracted into service modules

### Data Flow

1. Dashboard component fetches available diaries
2. User selects a diary and date
3. Application fetches and displays bookings for that diary and date
4. User can perform CRUD operations on these bookings
