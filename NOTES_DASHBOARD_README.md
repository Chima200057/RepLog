# Practice Map Feature 🗺️

## Overview

The Practice Map is a visual interface that transforms your notebook structure into an interactive coaching experience. It displays notebooks as parent cards and their pages as child cards, allowing you to select and send content to Bob for structured feedback.

## Features

### Visual Card Layout
- **Parent Cards (Notebooks)**: Large, gradient-styled cards showing notebook names and page counts
- **Child Cards (Pages)**: Smaller cards displaying page titles and content previews
- **Selection States**: Visual feedback with checkmarks and highlighting

### Smart Selection
- **Click Parent**: Selects all child pages from that notebook
- **Click Child**: Selects only that specific page
- **Preview Panel**: Shows selected content with metadata (word count, page count)

### Bob's Structured Feedback
When you send content to Bob from the Practice Map, he provides:
1. **🎉 Small Win**: Acknowledges a specific positive element
2. **🔍 Pattern/Observation**: Identifies meaningful patterns or insights
3. **🎯 Next Practice Focus**: Suggests one actionable next step

## How to Use

### 1. Open Practice Map
- Navigate to the **Notebooks** page (`/features`)
- Click the **Map icon** (🗺️) in the sidebar header
- The Practice Map modal will open

### 2. Select Content
**Option A - Review Entire Notebook:**
- Click on a parent card (notebook)
- All child pages are automatically selected
- Combined content appears in preview panel

**Option B - Review Single Note:**
- Click on a child card (page)
- Only that page is selected
- Page content appears in preview panel

### 3. Send to Bob
- Review the selected content in the preview panel
- Click **"Send to Bob"** button
- Wait for Bob's structured coaching response
- Review the three sections of feedback

### 4. Clear Selection
- Click the **"Clear"** button in the preview header
- Or select different content to replace current selection

## Guest Mode

Guest users can:
- ✅ Open and view the Practice Map
- ✅ Select and preview content
- ❌ Cannot send to Bob (upgrade prompt shown)

Sign up to unlock full Practice Map functionality!

## Technical Details

### Component Structure
```
PracticeMap.jsx          - Main modal component
PracticeMap.css          - Styling and animations
Notebook.jsx (modified)  - Integration point
server/index.js (modified) - API with Practice Map mode
```

### API Integration
The Practice Map uses the existing `/api/chat` endpoint with a special flag:
```javascript
{
  message: "combined content",
  practiceMapMode: true,
  history: []
}
```

This triggers a specialized system prompt that formats Bob's response into three structured sections.

### Response Parsing
The frontend parses Bob's response using emoji markers:
- `🎉 Small Win` → `sections.smallWin`
- `🔍 Pattern/Observation` → `sections.pattern`
- `🎯 Next Practice Focus` → `sections.nextFocus`

## Keyboard Shortcuts

- **Esc**: Close Practice Map modal
- **Click outside**: Close Practice Map modal

## Responsive Design

### Desktop (1200px+)
- Two-column layout: Canvas (left) + Preview (right)
- 3-column grid for child cards
- Full-width parent cards

### Tablet (768px - 1199px)
- Two-column layout maintained
- 2-column grid for child cards
- Narrower preview panel

### Mobile (< 768px)
- Single-column layout
- Canvas stacked above preview
- Single-column child cards
- Reduced padding and spacing

## Styling

### Color Scheme
- **Parent Cards**: Purple gradient (`#667eea` → `#764ba2`)
- **Child Cards**: Glassmorphic with backdrop blur
- **Selected State**: Accent border with glow effect
- **Bob Response Sections**: Color-coded borders
  - Small Win: Green (`#10b981`)
  - Pattern: Purple (`#667eea`)
  - Next Focus: Orange (`#f59e0b`)

### Animations
- **Modal Entrance**: Slide up with fade-in (300ms)
- **Card Hover**: Scale transform (200ms)
- **Selection**: Checkmark pop animation
- **Bob Response**: Staggered section reveal

## Best Practices

### For Best Results
1. **Select Related Content**: Choose notes from the same practice area
2. **Review Regularly**: Use Practice Map weekly to track progress
3. **Act on Feedback**: Implement Bob's "Next Practice Focus" suggestions
4. **Combine Notes**: Select parent cards to get holistic feedback

### Content Tips
- Keep notes focused and specific
- Include dates and metrics when relevant
- Document both successes and challenges
- Update notes regularly for better pattern detection

## Troubleshooting

### Practice Map Won't Open
- Ensure you're on the Notebooks page (`/features`)
- Check browser console for errors
- Verify React components are loaded

### Bob Not Responding
- Ensure backend server is running (`node server/index.js`)
- Check `.env` file has valid IBM credentials
- Verify network connection
- Check browser console for API errors

### Selection Not Working
- Try refreshing the page
- Clear browser cache
- Ensure JavaScript is enabled

### Styling Issues
- Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- Check if CSS files are loaded
- Verify no conflicting styles

## Future Enhancements

Potential features for future versions:
- [ ] Drag-and-drop card reordering
- [ ] Filter cards by date or tags
- [ ] Export Practice Map as image/PDF
- [ ] Visual connections between related notes
- [ ] Progress tracking visualization
- [ ] Bulk operations (archive, export)
- [ ] Custom card layouts
- [ ] Collaborative Practice Maps

## Feedback

Have suggestions for improving the Practice Map? Open an issue or submit a pull request!

---

**Built with ❤️ for RepLog by Team Vireon**