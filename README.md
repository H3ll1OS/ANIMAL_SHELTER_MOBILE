# Animal Shelter Mobile

Expo mobile app for the Animal Shelter Laravel web app.

## MySQL/Laravel API Connection

The mobile app connects to the same MySQL database as the web app through the Laravel API in:

```text
C:\wamp64\www\Animal_Shelter
```

Do not put MySQL credentials in the mobile app. The Laravel web app owns the database connection. Its `.env` currently points to MySQL database `an_shel`, and the mobile app calls:

```text
/Animal_Shelter/public/api/mobile
```

Create a local `.env` file in this mobile project using `.env.example` as the template. Pick the URL for your runtime:

```text
# Android emulator
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2/Animal_Shelter/public/api/mobile

# Expo web on the same PC
EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1/Animal_Shelter/public/api/mobile

# Physical phone on the same Wi-Fi
EXPO_PUBLIC_API_BASE_URL=http://YOUR_PC_LAN_IP/Animal_Shelter/public/api/mobile
```

Before starting the mobile app, make sure WAMP is running and the Laravel migrations have been applied in `C:\wamp64\www\Animal_Shelter`.

## Get Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the app:

   ```bash
   npx expo start
   ```
