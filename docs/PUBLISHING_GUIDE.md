# Publishing Your Hebrew Book App to Google Play Store

## Prerequisites

Before you start, make sure you have:
- A Google Play Console developer account ($25 one-time fee)
- Your book content ready
- App icon and promotional materials
- Privacy policy

## Step 1: Prepare Your App for Production

### Install EAS CLI (Expo Application Services)
```bash
npm install -g @expo/eas-cli
```

### Login to Expo
```bash
eas login
```

### Configure Build Settings
```bash
eas build:configure
```

This will create an `eas.json` file in your project root.

## Step 2: Update App Configuration

Update your `app.json` with production-ready settings:

```json
{
  "expo": {
    "name": "ספר החכמה והמוסר",
    "slug": "sefer-hachochma-vehamusar",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "android": {
      "package": "com.yourname.seferhachochma",
      "versionCode": 1,
      "icon": "./assets/images/icon.png",
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      }
    },
    "plugins": [
      "expo-router",
      "expo-font",
      "@react-native-async-storage/async-storage"
    ]
  }
}
```

## Step 3: Build Your Android App

```bash
# Build for Android production
eas build --platform android --profile production
```

This will create an APK or AAB file that you can upload to Google Play Console.

## Step 4: Google Play Console Setup

### Create Developer Account
1. Go to [Google Play Console](https://play.google.com/console)
2. Pay the $25 registration fee
3. Complete your developer profile

### Create New App
1. Click "Create app"
2. Fill in app details:
   - App name: "ספר החכמה והמוסר"
   - Default language: Hebrew
   - App or game: App
   - Free or paid: Choose based on your monetization strategy

## Step 5: Required Assets

### App Icon
- Size: 512x512 pixels
- Format: PNG (no transparency)
- High-resolution version of your app icon

### Feature Graphic
- Size: 1024x500 pixels
- Format: PNG or JPEG
- Showcases your app prominently

### Screenshots
- At least 2 phone screenshots
- Size: Between 320px and 3840px
- Show your app's main features in Hebrew

### Privacy Policy
Required for all apps. Should include:
- What data you collect (if any)
- How you use the data
- Third-party services used
- Contact information

## Step 6: Store Listing

### App Description (Hebrew)
```
ספר החכמה והמוסר - אוסף מאמרים ודרשות בנושאי אמונה, תפילה ותיקון המידות

תכונות האפליקציה:
• קריאה נוחה בעברית עם תמיכה מלאה ב-RTL
• חיפוש מתקדם בתוכן הספר
• סימניות לשמירת מקום הקריאה
• ממשק משתמש יפה ונוח לשימוש
• קריאה ללא חיבור לאינטרנט

הספר כולל חמישה פרקים עיקריים:
1. יסודות האמונה
2. כח התפילה
3. תיקון המידות
4. קדושת השבת
5. אהבת ישראל

מתאים לכל המעוניינים בלימוד ובהעמקה ברוחניות יהודית.
```

### App Description (English)
```
Sefer HaChochma VeHaMusar - A collection of articles and sermons on faith, prayer, and character development

App Features:
• Comfortable Hebrew reading with full RTL support
• Advanced search within the book content
• Bookmarks to save reading position
• Beautiful and user-friendly interface
• Offline reading capability

The book includes five main chapters:
1. Foundations of Faith
2. The Power of Prayer
3. Character Development
4. Sanctity of Sabbath
5. Love of Israel

Suitable for anyone interested in studying and deepening Jewish spirituality.
```

## Step 7: Content Rating

Complete Google's content rating questionnaire. For a religious book app, you'll likely get an "Everyone" rating.

## Step 8: Upload and Review

1. Upload your APK/AAB file
2. Fill in all required information
3. Submit for review
4. Wait for approval (usually 1-3 days)

## Step 9: Post-Launch

### Monitor Performance
- Check crash reports
- Monitor user reviews
- Track download statistics

### Updates
- Use `eas build` to create new versions
- Increment version code in app.json
- Upload new APK/AAB to Google Play Console

## Monetization Options

### Free App
- No cost to users
- Can include ads later
- Good for building user base

### Paid App
- One-time purchase
- Set price in Google Play Console
- Users pay before downloading

### Freemium
- Basic content free
- Premium chapters require purchase
- Use in-app purchases

## Legal Considerations

### Copyright
- Ensure you own rights to all content
- Include copyright notice in app
- Consider Creative Commons licensing

### Terms of Service
- Define usage terms
- Specify prohibited uses
- Include disclaimer

### Privacy Policy Template
```
Privacy Policy for ספר החכמה והמוסר

This app does not collect any personal information from users.

Data Storage:
- Reading bookmarks are stored locally on your device
- No data is transmitted to external servers
- No analytics or tracking is performed

Contact:
For questions about this privacy policy, contact: [your-email@example.com]

Last updated: [Date]
```

## Tips for Success

1. **Localization**: Ensure all text is properly localized for Hebrew
2. **Testing**: Test on various Android devices and screen sizes
3. **Reviews**: Encourage satisfied users to leave positive reviews
4. **Updates**: Regular updates show active development
5. **Community**: Engage with your user community

## Common Issues and Solutions

### Build Errors
- Check all dependencies are compatible
- Ensure proper Android configuration
- Review EAS build logs

### Store Rejection
- Follow Google Play policies strictly
- Ensure all metadata is accurate
- Test app thoroughly before submission

### Performance Issues
- Optimize images and assets
- Test on lower-end devices
- Monitor memory usage