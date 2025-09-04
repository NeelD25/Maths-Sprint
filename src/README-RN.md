# SSC Speed Math - React Native App

A React Native application for practicing quick math calculations, specifically designed for Indian government exam aspirants (SSC, Banking, etc.).

## Features

- **Multiple Math Operations**: Addition, Subtraction, Multiplication, Division, Squares, and Cubes
- **Mixed Practice Mode**: Combines all operations for comprehensive practice
- **Daily Challenge**: Pre-configured quiz with mixed questions
- **Customizable Ranges**: Set min/max number ranges for each operation
- **Timed Quizzes**: 30-second timer per question to improve speed
- **Progress Tracking**: View results, statistics, and achievements
- **AdMob Integration**: Monetization through banner ads
- **Dark Theme**: Professional dark mode design
- **Offline Support**: Generate infinite questions without internet

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ssc-speed-math
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install Expo CLI globally** (if not already installed)
   ```bash
   npm install -g @expo/cli
   ```

## Setup AdMob

1. **Create a Google AdMob Account**
   - Visit [AdMob](https://admob.google.com/)
   - Create an account and set up your app

2. **Update app.json**
   Replace the placeholder AdMob IDs in `app.json`:
   ```json
   "plugins": [
     [
       "react-native-google-mobile-ads",
       {
         "android_app_id": "ca-app-pub-YOUR_PUBLISHER_ID~YOUR_APP_ID",
         "ios_app_id": "ca-app-pub-YOUR_PUBLISHER_ID~YOUR_APP_ID"
       }
     ]
   ]
   ```

3. **Update AdBanner component**
   Replace the test ad unit ID in `components/AdBanner.tsx`:
   ```typescript
   const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-YOUR_PUBLISHER_ID/YOUR_AD_UNIT_ID';
   ```

## Development

1. **Start the development server**
   ```bash
   npx expo start
   ```

2. **Run on Android**
   ```bash
   npx expo start --android
   ```

3. **Run on iOS**
   ```bash
   npx expo start --ios
   ```

4. **Run on Web**
   ```bash
   npx expo start --web
   ```

## Building for Production

### Prerequisites for EAS Build

1. **Install EAS CLI**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure EAS Build**
   ```bash
   eas build:configure
   ```

### Android Build

1. **Build APK**
   ```bash
   eas build --platform android --profile preview
   ```

2. **Build for Google Play Store**
   ```bash
   eas build --platform android --profile production
   ```

### iOS Build

1. **Build for iOS Simulator**
   ```bash
   eas build --platform ios --profile preview
   ```

2. **Build for App Store**
   ```bash
   eas build --platform ios --profile production
   ```

## Project Structure

```
├── App.tsx                 # Main app component with navigation
├── components/
│   ├── HomeScreen.tsx      # Home screen with operation selection
│   ├── QuizScreen.tsx      # Quiz interface with questions and timer
│   ├── ResultsScreen.tsx   # Results display and history
│   ├── ProfileScreen.tsx   # User profile and settings
│   ├── NumberRangePopup.tsx # Popup for configuring quiz settings
│   └── AdBanner.tsx        # AdMob banner component
├── utils/
│   └── questionGenerator.ts # Question generation logic
├── app.json                # Expo configuration
├── package.json           # Dependencies and scripts
└── babel.config.js        # Babel configuration
```

## Key Components

### Navigation
- Uses React Navigation with bottom tabs
- Stack navigation for quiz flow

### Question Generation
- Pure JavaScript functions for generating math questions
- Supports all basic operations and mixed mode
- Configurable number ranges

### Styling
- React Native StyleSheet for performance
- Dark theme with gradient backgrounds
- Responsive design for different screen sizes

### AdMob Integration
- Banner ads on home, quiz, results, and profile screens
- Test ads in development mode
- Production ad units for release

## Customization

### Adding New Operations
1. Add operation logic in `utils/questionGenerator.ts`
2. Update operation list in `HomeScreen.tsx`
3. Add appropriate icons and colors

### Modifying UI Theme
- Update color values in component styles
- Modify LinearGradient colors for different themes
- Update icon colors and sizes

### Adding New Features
- Follow the existing component structure
- Use TypeScript for type safety
- Implement proper navigation between screens

## Testing

1. **Test on Expo Go App**
   - Install Expo Go on your device
   - Scan QR code from `npx expo start`

2. **Test AdMob Integration**
   - Use test ad units during development
   - Verify ads load correctly on different screens

## Publishing

### Google Play Store
1. Build production APK/AAB with EAS
2. Create Google Play Developer account
3. Upload and configure app listing
4. Submit for review

### Apple App Store
1. Build production IPA with EAS
2. Create Apple Developer account
3. Use App Store Connect to upload
4. Submit for review

## Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npx expo start --clear
   ```

2. **Navigation errors**
   - Ensure all navigation dependencies are installed
   - Check React Navigation version compatibility

3. **AdMob errors**
   - Verify AdMob IDs are correct
   - Check internet connection for ad loading
   - Ensure AdMob account is properly configured

4. **Build errors**
   - Clear cache: `npx expo start --clear`
   - Delete node_modules and reinstall
   - Check EAS CLI version compatibility

## Performance Optimization

- Use React.memo for expensive components
- Optimize image assets
- Implement lazy loading for screens
- Use React Native's performance monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper TypeScript types
4. Test on both iOS and Android
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the troubleshooting section
- Create an issue on the repository
- Check Expo and React Navigation documentation

---

Built with ❤️ using React Native and Expo