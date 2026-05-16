# Practice Map Testing Guide

## Pre-Testing Setup

1. **Start the Backend Server**
   ```bash
   node server/index.js
   ```
   Verify: Console shows "RepLog Backend running on http://localhost:3001"

2. **Start the Frontend**
   ```bash
   npm run dev
   ```
   Verify: Vite dev server starts successfully

3. **Open Application**
   - Navigate to `http://localhost:5173` (or your Vite port)
   - Sign in or continue as guest

## Test Cases

### Test 1: Opening Practice Map
**Steps:**
1. Navigate to Notebooks page (click "Features" in navbar)
2. Look for Map icon (🗺️) in sidebar header
3. Click the Map icon

**Expected Result:**
- Modal opens with slide-up animation
- Canvas shows all notebooks and their pages as cards
- Preview panel shows "No selection" state

**Status:** [ ] Pass [ ] Fail

---

### Test 2: Parent Card Selection
**Steps:**
1. Open Practice Map
2. Click on a parent card (e.g., "Personal" notebook)

**Expected Result:**
- Parent card shows checkmark and highlight
- All child cards from that notebook show checkmarks
- Preview panel displays combined content
- Metadata shows correct page count and word count
- "Send to Bob" button is visible (if logged in)

**Status:** [ ] Pass [ ] Fail

---

### Test 3: Child Card Selection
**Steps:**
1. Open Practice Map
2. Click on a single child card (page)

**Expected Result:**
- Only that child card shows checkmark
- Preview panel displays that page's content
- Metadata shows "1 note"
- Parent card is NOT highlighted

**Status:** [ ] Pass [ ] Fail

---

### Test 4: Selection Switching
**Steps:**
1. Select a parent card
2. Then click a different child card

**Expected Result:**
- Previous selection clears
- New selection highlights
- Preview updates to show new content

**Status:** [ ] Pass [ ] Fail

---

### Test 5: Clear Selection
**Steps:**
1. Select any card
2. Click "Clear" button in preview header

**Expected Result:**
- All selections clear
- Preview returns to "No selection" state
- Cards return to unselected state

**Status:** [ ] Pass [ ] Fail

---

### Test 6: Send to Bob (Logged In User)
**Steps:**
1. Sign in as a user
2. Open Practice Map
3. Select a parent or child card
4. Click "Send to Bob"

**Expected Result:**
- Button shows "Sending to Bob..." state
- After response, three sections appear:
  - 🎉 Small Win
  - 🔍 Pattern/Observation
  - 🎯 Next Practice Focus
- Each section has content
- Sections animate in with stagger effect

**Status:** [ ] Pass [ ] Fail

---

### Test 7: Guest Mode Restriction
**Steps:**
1. Log out (or use guest mode)
2. Open Practice Map
3. Select content
4. Observe "Send to Bob" button

**Expected Result:**
- Button shows lock icon
- Text reads "Sign up to send to Bob"
- Button is disabled
- Clicking does nothing

**Status:** [ ] Pass [ ] Fail

---

### Test 8: Visual Styling
**Steps:**
1. Open Practice Map
2. Observe card styling
3. Hover over cards
4. Check responsive behavior

**Expected Result:**
- Parent cards have purple gradient
- Child cards have glassmorphic effect
- Hover effects work smoothly
- Selected states are clearly visible
- Animations are smooth (no jank)

**Status:** [ ] Pass [ ] Fail

---

### Test 9: Modal Interactions
**Steps:**
1. Open Practice Map
2. Try closing via:
   - X button
   - Clicking outside modal
   - ESC key (if implemented)

**Expected Result:**
- Modal closes smoothly
- Returns to Notebook page
- No errors in console

**Status:** [ ] Pass [ ] Fail

---

### Test 10: Responsive Design
**Steps:**
1. Open Practice Map on desktop
2. Resize browser to tablet width (~800px)
3. Resize to mobile width (~400px)

**Expected Result:**
- Desktop: Two-column layout (canvas + preview)
- Tablet: Layout adjusts, cards reflow
- Mobile: Single column, stacked layout
- All content remains accessible
- No horizontal scroll

**Status:** [ ] Pass [ ] Fail

---

### Test 11: Empty Notebook Handling
**Steps:**
1. Create a new notebook with no pages
2. Open Practice Map
3. Click the empty notebook card

**Expected Result:**
- Card is clickable
- Preview shows appropriate message
- No errors occur
- "Send to Bob" handles empty content gracefully

**Status:** [ ] Pass [ ] Fail

---

### Test 12: Long Content Handling
**Steps:**
1. Create a page with very long content (1000+ words)
2. Select that page in Practice Map
3. Review preview panel

**Expected Result:**
- Preview panel scrolls smoothly
- Content is fully readable
- No layout breaks
- Word count is accurate

**Status:** [ ] Pass [ ] Fail

---

### Test 13: Multiple Notebooks
**Steps:**
1. Ensure you have 3+ notebooks with multiple pages each
2. Open Practice Map
3. Scroll through canvas

**Expected Result:**
- All notebooks display correctly
- Cards are organized by notebook
- Scrolling is smooth
- No performance issues

**Status:** [ ] Pass [ ] Fail

---

### Test 14: Bob Response Parsing
**Steps:**
1. Send content to Bob
2. Check if response has all three sections
3. Verify emoji headers are present

**Expected Result:**
- Response parses correctly
- Three sections display separately
- Emojis show correctly
- Text formatting is preserved
- Color-coded borders appear

**Status:** [ ] Pass [ ] Fail

---

### Test 15: Error Handling
**Steps:**
1. Stop the backend server
2. Try to send content to Bob

**Expected Result:**
- Error message displays
- No app crash
- User can still interact with Practice Map
- Can close modal and retry later

**Status:** [ ] Pass [ ] Fail

---

## Performance Checks

### Load Time
- [ ] Practice Map opens in < 200ms
- [ ] Card rendering completes in < 500ms
- [ ] No visible lag when selecting cards

### Memory
- [ ] No memory leaks when opening/closing repeatedly
- [ ] Browser remains responsive
- [ ] No console warnings

### Network
- [ ] API call completes in < 3 seconds
- [ ] Proper loading states shown
- [ ] Failed requests handled gracefully

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

## Accessibility

- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Color contrast is sufficient
- [ ] Screen reader friendly (if tested)

## Final Checklist

- [ ] All test cases pass
- [ ] No console errors
- [ ] No console warnings
- [ ] Performance is acceptable
- [ ] UI is polished and professional
- [ ] Feature works in guest and logged-in modes
- [ ] Responsive design works on all screen sizes
- [ ] Bob's responses are helpful and well-formatted

## Notes

Use this section to document any issues found:

```
Issue 1: [Description]
Severity: [Low/Medium/High]
Steps to reproduce: [...]
Expected: [...]
Actual: [...]

Issue 2: [Description]
...
```

---

**Testing completed by:** _______________
**Date:** _______________
**Overall Status:** [ ] Pass [ ] Fail [ ] Needs Work