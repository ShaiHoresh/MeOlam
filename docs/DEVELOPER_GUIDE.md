# Developer Guide - Hebrew Book Reading App

## Overview

This guide explains how to add new books to the Hebrew Book Reading App. The app is designed to display Hebrew religious texts with proper RTL (Right-to-Left) support, search functionality, and bookmarking.

## Book Data Structure

Books are stored in the `data/bookData.ts` file using the following TypeScript interfaces:

```typescript
export interface Chapter {
  id: string;           // Unique identifier (e.g., "chapter-1")
  title: string;        // Chapter title in Hebrew
  subtitle: string;     // Chapter subtitle/description
  startPage: number;    // Starting page number
  endPage: number;      // Ending page number
  content: string;      // Full chapter content in Hebrew
}

export interface BookData {
  title: string;        // Book title in Hebrew
  subtitle: string;     // Book subtitle/description
  author: string;       // Author name in Hebrew
  chapters: Chapter[];  // Array of chapters
}
```

## Adding a New Book

### Step 1: Prepare Your Content

1. **Format your text**: Ensure all text is in Hebrew with proper formatting
2. **Divide into chapters**: Split your book into logical chapters
3. **Clean the text**: Remove any unwanted formatting or characters

### Step 2: Update the Data File

Edit `data/bookData.ts` and replace the existing `bookData` object:

```typescript
export const bookData: BookData = {
  title: "שם הספר החדש",
  subtitle: "תיאור הספר",
  author: "שם המחבר",
  chapters: [
    {
      id: "chapter-1",
      title: "פרק א׳ - כותרת הפרק",
      subtitle: "תת כותרת או תיאור הפרק",
      startPage: 1,
      endPage: 20,
      content: `תוכן הפרק המלא כאן...
      
      יכול להכיל מספר פסקאות
      ושורות מרובות.
      
      הטקסט צריך להיות בעברית עם תמיכה מלאה ב-RTL.`
    },
    {
      id: "chapter-2",
      title: "פרק ב׳ - כותרת הפרק השני",
      subtitle: "תת כותרת של הפרק השני",
      startPage: 21,
      endPage: 35,
      content: `תוכן הפרק השני...`
    }
    // Add more chapters as needed
  ]
};
```

### Step 3: Content Guidelines

#### Chapter IDs
- Use sequential IDs: `chapter-1`, `chapter-2`, etc.
- Keep them consistent and unique

#### Page Numbers
- Start from page 1 for the first chapter
- Make sure page ranges don't overlap
- Estimate pages based on content length (roughly 2000-3000 characters per page)

#### Hebrew Text Formatting
- Use proper Hebrew punctuation (״ ״ for quotes, etc.)
- Include proper spacing between words
- Use line breaks (`\n`) for paragraph separation
- For longer content, use template literals with backticks

#### Content Structure Example
```typescript
content: `כותרת הפרק

פסקה ראשונה של התוכן. הטקסט צריך להיות ברור וקריא.

פסקה שנייה עם תוכן נוסף. ניתן להשתמש בציטוטים ״כמו כאן״ ובהדגשות אחרות.

פסקה שלישית עם המשך התוכן...`
```

## File Structure

```
src/
├── data/
│   └── bookData.ts          # Main book data file (edit this)
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx        # Table of contents
│   │   ├── search.tsx       # Search functionality
│   │   └── bookmarks.tsx    # Bookmark management
│   └── reader/
│       └── [chapter].tsx    # Chapter reading view
└── components/              # Reusable UI components
```

## Testing Your Changes

1. **Save the file**: After editing `data/bookData.ts`, save the file
2. **Restart the app**: The development server should automatically reload
3. **Test navigation**: Check that all chapters appear in the table of contents
4. **Test reading**: Open each chapter to ensure content displays correctly
5. **Test search**: Search for words from your content to verify search works
6. **Test RTL**: Ensure Hebrew text displays right-to-left correctly

## Best Practices

### Content Preparation
1. **Proofread**: Check for typos and formatting issues
2. **Consistent formatting**: Use the same style for all chapters
3. **Logical division**: Split content into readable chapter sizes
4. **Clear titles**: Use descriptive chapter titles and subtitles

### Technical Considerations
1. **Character encoding**: Ensure all Hebrew text is properly encoded (UTF-8)
2. **Escape characters**: Use proper escaping for quotes and special characters
3. **Performance**: Very long chapters may impact performance; consider splitting them
4. **Memory usage**: Large books may require optimization for mobile devices

### Hebrew Text Guidelines
1. **RTL support**: The app automatically handles RTL layout
2. **Font compatibility**: Use standard Hebrew characters that display well on all devices
3. **Punctuation**: Use proper Hebrew punctuation marks
4. **Spacing**: Ensure proper spacing between words and sentences

## Example: Complete Book Addition

Here's a complete example of adding a new book:

```typescript
export const bookData: BookData = {
  title: "ספר הדרכה רוחנית",
  subtitle: "מדריך לחיים יהודיים",
  author: "הרב דוגמה",
  chapters: [
    {
      id: "chapter-1",
      title: "פרק א׳ - התחלת הדרך",
      subtitle: "יסודות בעבודת ה׳",
      startPage: 1,
      endPage: 18,
      content: `פרק א׳ - התחלת הדרך

בתחילת דרכו של האדם בעבודת ה׳, חשוב להבין את היסודות הבסיסיים. 

הדבר הראשון שצריך לדעת הוא שעבודת ה׳ היא לא רק קיום מצוות, אלא דרך חיים שלמה.

כל מעשה ומחשבה צריכים להיות מכוונים לשם שמים, ובכך האדם מקדש את כל חייו.`
    },
    {
      id: "chapter-2", 
      title: "פרק ב׳ - התפילה היומית",
      subtitle: "כוונות ודרכי עבודה",
      startPage: 19,
      endPage: 35,
      content: `פרק ב׳ - התפילה היומית

התפילה היא אחד הכלים החשובים ביותר בעבודת ה׳. היא מחברת אותנו לבורא עולם ומעלה את נשמתנו.

חשוב להתכונן לתפילה ולא להתפלל בחיפזון. הכנה נכונה כוללת ניקוי המחשבות והתמקדות בעניין התפילה.`
    }
  ]
};
```

## Troubleshooting

### Common Issues

1. **Text not displaying**: Check for proper UTF-8 encoding
2. **Search not working**: Ensure content is properly formatted as strings
3. **Navigation errors**: Verify all chapter IDs are unique and properly formatted
4. **RTL issues**: Make sure no LTR characters are mixed in the Hebrew text

### Error Messages

- **"Chapter not found"**: Check that chapter IDs match between navigation and data
- **"Content not loading"**: Verify the content string is properly formatted
- **"Search results empty"**: Ensure search terms exist in the content

## Advanced Features

### Adding Multiple Books

To support multiple books, you would need to:

1. Create separate data files for each book
2. Modify the app structure to handle book selection
3. Update navigation to include book switching
4. Modify the search to work across multiple books

### Custom Styling

The app uses consistent styling for Hebrew text. If you need custom styling:

1. Edit the StyleSheet objects in the component files
2. Ensure RTL compatibility is maintained
3. Test on different screen sizes

### Performance Optimization

For very large books:

1. Consider lazy loading of chapter content
2. Implement pagination for long chapters
3. Optimize search algorithms for large text volumes
4. Use React.memo for performance-critical components

## Support

If you encounter issues while adding new books:

1. Check the browser console for error messages
2. Verify your JSON syntax is correct
3. Test with a small sample first
4. Ensure all required fields are present in your data structure

Remember: This app is designed for Hebrew religious texts with RTL support. All content should be in Hebrew and follow the established patterns for best results.