# AI Helpers

This project is an AI-based assistant application built with React Native, Firebase, and OpenAI's GPT model.
   

## Features
- Connected to OpenAI's API
- Real Auth via Firebase with Registration, Login, ForgotPassword screens
- Side menu with task list that navigate to chat
- Multiple assistants
- Local conversation storage
- Image picker integration

## Prerequisites
- Node.js installed
- Firebase account
- OpenAI API key

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Justaslol/AIHelpers.git
cd AIHelpers
```

### 2. Install dependencies
``` bash
npm install
```

### 3. Add Environment Variables
- Create a `.env` file in the root directory
- Add your Firebase and OpenAI credentials
```
OPENAI_API_KEY=your_openai_api_key
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=sintra-test-app.firebaseapp.com
FIREBASE_PROJECT_ID=sintra-test-app
FIREBASE_STORAGE_BUCKET=sintra-test-app.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
```

### 4. Run the application

For iOS:
```bash
npx expo start --ios
```

For Android:
```bash
npx expo start --android
```

## Showcase


https://github.com/user-attachments/assets/b33ff09f-d457-46e1-a383-6e098dc957f9



