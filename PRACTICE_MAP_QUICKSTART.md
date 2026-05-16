# Practice Map Quick Start Guide

## For Developers

### 1. Verify Installation (30 seconds)

Check that all new files exist:
```bash
# Component files
ls src/components/PracticeMap.jsx
ls src/components/PracticeMap.css

# Documentation
ls PRACTICE_MAP_*.md
```

### 2. Start the Application (1 minute)

```bash
# Terminal 1: Start backend
node server/index.js

# Terminal 2: Start frontend
npm run dev
```

### 3. Access Practice Map (30 seconds)

1. Open browser to `http://localhost:5173`
2. Navigate to **Features** (Notebooks page)
3. Click the **Map icon** (🗺️) in the sidebar header
4. Practice Map modal should open

### 4. Quick Test (2 minutes)

**Test Parent Selection:**
1. Click on "Personal" notebook card
2. Verify all child pages are selected
3. Check preview panel shows combined content

**Test Child Selection:**
1. Click on a single page card
2. Verify only that page is selected
3. Check preview shows single page content

**Test Send to Bob (if logged in):**
1. Select any content
2. Click "Send to Bob"
3. Wait for structured response
4. Verify three sections appear

### 5. Common Issues & Fixes

**Issue: Modal doesn't open**
```bash
# Check console for errors
# Verify import in Notebook.jsx
# Hard refresh: Ctrl+Shift+R
```

**Issue: Cards not displaying**
```bash
# Verify notebooks have pages
# Check browser console
# Verify CSS is loaded
```

**Issue: Bob not responding**
```bash
# Verify backend is running
# Check .env file has IBM credentials
# Check network tab for API errors
```

## For Users

### How to Use Practice Map

1. **Open Practice Map**
   - Go to Notebooks page
   - Click Map icon in sidebar

2. **Select Content**
   - Click notebook card → reviews all notes
   - Click page card → reviews single note

3. **Get Feedback**
   - Click "Send to Bob"
   - Read three sections:
     - 🎉 Small Win
     - 🔍 Pattern/Observation
     - 🎯 Next Practice Focus

4. **Clear & Repeat**
   - Click "Clear" to reset
   - Select different content
   - Get new feedback

## File Structure

```
RepLog/
├── src/
│   ├── components/
│   │   ├── PracticeMap.jsx      ← Main component
│   │   └── PracticeMap.css      ← Styling
│   └── pages/
│       ├── Notebook.jsx         ← Modified (trigger button)
│       └── Notebook.css         ← Modified (button style)
├── server/
│   └── index.js                 ← Modified (API mode)
├── PRACTICE_MAP_PLAN.md         ← Architecture
├── PRACTICE_MAP_README.md       ← User guide
├── PRACTICE_MAP_TEST_GUIDE.md   ← Testing
├── PRACTICE_MAP_IMPLEMENTATION_SUMMARY.md
└── PRACTICE_MAP_QUICKSTART.md   ← This file
```

## Key Code Locations

### Opening the Modal
**File**: `src/pages/Notebook.jsx`
```jsx
const [isPracticeMapOpen, setIsPracticeMapOpen] = useState(false);

// Trigger button
<button onClick={() => setIsPracticeMapOpen(true)}>
  <Map size={16} />
</button>

// Modal component
<PracticeMap
  isOpen={isPracticeMapOpen}
  onClose={() => setIsPracticeMapOpen(false)}
  notebooks={notebooks}
  isGuest={isGuest}
/>
```

### Selection Logic
**File**: `src/components/PracticeMap.jsx`
```jsx
// Parent selection
const handleParentClick = (notebook) => {
  const pageIds = notebook.pages.map(p => p.id);
  setSelectedItems([notebook.id, ...pageIds]);
  // ... combine content
};

// Child selection
const handleChildClick = (page, notebookName) => {
  setSelectedItems([page.id]);
  // ... show single page
};
```

### API Integration
**File**: `server/index.js`
```javascript
const { message, practiceMapMode = false } = req.body;

const systemPrompt = practiceMapMode 
  ? /* Practice Map prompt with 3 sections */
  : /* Regular coaching prompt */;
```

## Customization Points

### Change Card Colors
**File**: `src/components/PracticeMap.css`
```css
.practice-map-parent-card {
  background: linear-gradient(135deg, 
    rgba(102, 126, 234, 0.2),  /* Change these */
    rgba(118, 75, 162, 0.2)
  );
}
```

### Modify Response Sections
**File**: `server/index.js`
```javascript
// Change emoji or section names
🎉 Small Win:
🔍 Pattern/Observation:
🎯 Next Practice Focus:
```

### Adjust Card Sizes
**File**: `src/components/PracticeMap.css`
```css
.practice-map-parent-card {
  /* Currently 200×150px, adjust as needed */
}

.practice-map-child-card {
  /* Currently 160×120px, adjust as needed */
  min-height: 120px;
}
```

## Debugging Tips

### Enable Verbose Logging
```javascript
// In PracticeMap.jsx
console.log('Selected items:', selectedItems);
console.log('Preview content:', previewContent);
console.log('Bob response:', bobResponse);
```

### Check API Calls
```javascript
// In browser DevTools Network tab
// Look for POST to /api/chat
// Check request payload has practiceMapMode: true
// Verify response structure
```

### Inspect State
```javascript
// Use React DevTools
// Find PracticeMap component
// Inspect hooks: selectedItems, previewContent, bobResponse
```

## Performance Tips

### For Large Notebooks (50+ pages)
- Cards render efficiently with CSS Grid
- Preview uses virtual scrolling
- Consider pagination if > 100 pages

### For Slow Networks
- Loading states are built-in
- Consider adding retry logic
- Add offline detection

## Next Steps

1. ✅ Feature is implemented
2. ⏳ Test with real IBM WatsonX API
3. ⏳ Gather user feedback
4. ⏳ Iterate based on usage patterns
5. ⏳ Add Phase 2 features (see PRACTICE_MAP_PLAN.md)

## Support

- **Documentation**: See PRACTICE_MAP_README.md
- **Testing**: See PRACTICE_MAP_TEST_GUIDE.md
- **Architecture**: See PRACTICE_MAP_PLAN.md
- **Summary**: See PRACTICE_MAP_IMPLEMENTATION_SUMMARY.md

## Quick Reference

| Action | Location | File |
|--------|----------|------|
| Open modal | Notebooks page, Map icon | Notebook.jsx |
| Select parent | Click notebook card | PracticeMap.jsx |
| Select child | Click page card | PracticeMap.jsx |
| Send to Bob | Preview panel button | PracticeMap.jsx |
| API mode | practiceMapMode flag | server/index.js |
| Styling | All styles | PracticeMap.css |

---

**Ready to go!** 🚀

Start the servers and click the Map icon to see your Practice Map in action.