# SSC Speed Math - Android Build Instructions

## Prerequisites
1. **Android Studio** (latest version) - Download from https://developer.android.com/studio
2. **Java JDK 8 or higher**
3. **Android SDK** (API level 21+)

## Project Setup

### 1. Open Project in Android Studio
```bash
1. Launch Android Studio
2. Click "Open an Existing Project"
3. Navigate to the project folder and select it
4. Wait for Gradle sync to complete
```

### 2. Configure Project
```bash
1. In Android Studio, go to File > Project Structure
2. Ensure Project SDK is set to Android API 34
3. Set Gradle JDK to Java 11 or higher
```

### 3. Update Dependencies
```bash
1. Open app/build.gradle.kts
2. Sync project (click "Sync Now" when prompted)
3. Wait for all dependencies to download
```

## Google AdMob Configuration

### 1. Get AdMob App ID
```bash
1. Go to https://admob.google.com/
2. Create an account and add your app
3. Get your App ID and Ad Unit IDs
4. Replace test IDs in the code:
   - In AndroidManifest.xml: Replace "ca-app-pub-3940256099942544~3347511713"
   - In layout files: Replace "ca-app-pub-3940256099942544/6300978111"
```

### 2. Update AdMob IDs
```kotlin
// In AndroidManifest.xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="YOUR_ADMOB_APP_ID" />

// In layout files (fragment_home.xml, activity_quiz.xml, etc.)
ads:adUnitId="YOUR_BANNER_AD_UNIT_ID"
```

## Building APK

### Debug APK (for testing)
```bash
1. In Android Studio: Build > Build Bundle(s) / APK(s) > Build APK(s)
2. Wait for build to complete
3. APK location: app/build/outputs/apk/debug/app-debug.apk
```

### Release APK (for distribution)

#### 1. Generate Signing Key
```bash
1. In Android Studio: Build > Generate Signed Bundle / APK
2. Choose "APK"
3. Click "Create new..." to generate keystore
4. Fill in keystore details:
   - Key store path: Choose location to save .jks file
   - Password: Create strong password
   - Key alias: Choose alias name
   - Key password: Create password
   - Validity: 25 years
   - Certificate info: Fill your details
5. Click "OK" and remember these details!
```

#### 2. Build Release APK
```bash
1. Build > Generate Signed Bundle / APK
2. Select existing keystore file
3. Enter keystore and key passwords
4. Choose "release" build variant
5. Check both signature versions (V1 and V2)
6. Click "Finish"
7. APK location: app/release/app-release.apk
```

## Optimization for File Size

### 1. Enable ProGuard (already configured)
```kotlin
// In app/build.gradle.kts
buildTypes {
    release {
        isMinifyEnabled = true
        isShrinkResources = true
        proguardFiles(...)
    }
}
```

### 2. Generate App Bundle (recommended)
```bash
1. Build > Generate Signed Bundle / APK
2. Choose "Android App Bundle"
3. Use same signing key as APK
4. Upload .aab file to Google Play Store
5. Google Play will generate optimized APKs for each device
```

### 3. Reduce APK Size Further
```bash
1. Use vector drawables instead of PNG images
2. Enable R8 full mode in gradle.properties:
   android.enableR8.fullMode=true
3. Use APK Analyzer: Build > Analyze APK
```

## Testing

### 1. Test on Device/Emulator
```bash
1. Connect Android device with USB debugging enabled
2. Or create AVD (Android Virtual Device) in Android Studio
3. Click "Run" button or press Shift+F10
4. App will install and launch automatically
```

### 2. Test AdMob Integration
```bash
1. For testing, use test ad unit IDs (already in code)
2. For production, replace with your real ad unit IDs
3. Test ad loading in different network conditions
```

## Publishing to Google Play Store

### 1. Prepare for Release
```bash
1. Update app version in build.gradle.kts
2. Create app screenshots (required for Play Store)
3. Write app description and metadata
4. Set appropriate app permissions
```

### 2. Upload to Play Console
```bash
1. Go to https://play.google.com/console
2. Create developer account ($25 one-time fee)
3. Create new app
4. Upload app bundle (.aab file)
5. Fill in store listing details
6. Submit for review
```

## Troubleshooting

### Common Issues
```bash
1. Gradle sync failed:
   - Check internet connection
   - Update Android Studio
   - Clean and rebuild project

2. AdMob ads not showing:
   - Check internet connection
   - Verify ad unit IDs
   - Wait for ad inventory (test ads load faster)

3. APK build failed:
   - Check for code errors
   - Update dependencies
   - Clear Gradle cache: ~/.gradle/caches
```

### Performance Tips
```bash
1. Test on real devices with different screen sizes
2. Monitor memory usage with Android Profiler
3. Test in airplane mode to ensure offline functionality works
4. Use Android Studio's Layout Inspector for UI debugging
```

## File Structure Overview
```
app/
├── src/main/
│   ├── java/com/sscspeedmath/app/
│   │   ├── MainActivity.kt
│   │   ├── data/models/
│   │   ├── ui/fragments/
│   │   ├── ui/quiz/
│   │   └── utils/
│   ├── res/
│   │   ├── layout/
│   │   ├── values/
│   │   ├── drawable/
│   │   └── menu/
│   └── AndroidManifest.xml
├── build.gradle.kts
└── proguard-rules.pro
```

The app is now ready for building and distribution!