# Practice Map Visual Guide

## User Interface Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Practice Map                                                      [X]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ℹ️ Click a notebook to review all notes, or click individual notes   │
│                                                                         │
│  ┌─────────────────────────────────┬─────────────────────────────────┐ │
│  │  CANVAS (Scrollable)            │  PREVIEW PANEL                  │ │
│  │                                 │                                 │ │
│  │  ┌──────────────────┐           │  Selected Content               │ │
│  │  │  📚 Personal     │           │  ─────────────────────────────  │ │
│  │  │  3 notes      ✓  │           │                                 │ │
│  │  └──────────────────┘           │  Personal (3 notes)             │ │
│  │                                 │  • 450 words                    │ │
│  │  ┌────────┐ ┌────────┐         │                                 │ │
│  │  │📄 Note1│ │📄 Note2│         │  [Markdown Content Here]        │ │
│  │  │  ✓     │ │  ✓     │         │                                 │ │
│  │  └────────┘ └────────┘         │                                 │ │
│  │  ┌────────┐                    │                                 │ │
│  │  │📄 Note3│                    │                                 │ │
│  │  │  ✓     │                    │  ─────────────────────────────  │ │
│  │  └────────┘                    │  [  Send to Bob 🤖  ]          │ │
│  │                                 │                                 │ │
│  │  ┌──────────────────┐           │  ═════════════════════════════  │ │
│  │  │  📚 Work         │           │  Bob's Coaching Feedback        │ │
│  │  │  2 notes         │           │  ─────────────────────────────  │ │
│  │  └──────────────────┘           │                                 │ │
│  │                                 │  🎉 Small Win                   │ │
│  │  ┌────────┐ ┌────────┐         │  Great consistency this week!   │ │
│  │  │📄 Note4│ │📄 Note5│         │                                 │ │
│  │  └────────┘ └────────┘         │  🔍 Pattern/Observation         │ │
│  │                                 │  I notice you're improving...   │ │
│  │                                 │                                 │ │
│  │                                 │  🎯 Next Practice Focus         │ │
│  │                                 │  Focus on technique next...     │ │
│  └─────────────────────────────────┴─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

## Card Types

### Parent Card (Notebook)
```
┌──────────────────────────────────┐
│  📚                           3  │  ← Badge shows page count
│                                  │
│  Personal                        │  ← Notebook name
│  3 notes                         │  ← Subtitle
│                              ✓   │  ← Checkmark when selected
└──────────────────────────────────┘
   ↑ Purple gradient background
```

### Child Card (Page)
```
┌────────────────────┐
│  📄            ✓   │  ← Checkmark when selected
│                    │
│  Welcome to RepLog │  ← Page title
│                    │
│  Start writing...  │  ← Content preview
└────────────────────┘
   ↑ Glassmorphic effect
```

## Interaction Flow

### Scenario 1: Review All Notes from a Notebook

```
User Action                    System Response
───────────                    ───────────────

1. Click "Personal"     →     • Highlight parent card
   notebook card               • Highlight all 3 child cards
                              • Show combined content in preview
                              • Display metadata: "3 notes, 450 words"

2. Click "Send to Bob"  →     • Show loading state
                              • Call API with practiceMapMode: true
                              • Parse response into 3 sections

3. View feedback        →     • Display 🎉 Small Win
                              • Display 🔍 Pattern/Observation
                              • Display 🎯 Next Practice Focus
                              • Animate sections with stagger
```

### Scenario 2: Review Single Note

```
User Action                    System Response
───────────                    ───────────────

1. Click "Note 2"       →     • Highlight only that card
   page card                   • Show single page content
                              • Display metadata: "1 note, 150 words"

2. Click "Send to Bob"  →     • Show loading state
                              • Call API with practiceMapMode: true
                              • Parse response into 3 sections

3. View feedback        →     • Display structured feedback
                              • Focus on that specific note
```

## Selection States

### No Selection
```
Canvas: All cards in default state
Preview: "No selection" empty state with icon
Button: Hidden or disabled
```

### Parent Selected
```
Canvas: Parent card + all children highlighted with ✓
Preview: Combined content from all pages
Button: "Send to Bob" enabled (if logged in)
```

### Child Selected
```
Canvas: Single child card highlighted with ✓
Preview: Single page content
Button: "Send to Bob" enabled (if logged in)
```

## Color Coding

### Card States
```
Default:     rgba(255, 255, 255, 0.05)  - Subtle background
Hover:       rgba(255, 255, 255, 0.08)  - Slightly brighter
Selected:    rgba(102, 126, 234, 0.15)  - Purple tint
```

### Bob's Response Sections
```
🎉 Small Win:           Green border   (#10b981)
🔍 Pattern/Observation: Purple border  (#667eea)
🎯 Next Practice Focus: Orange border  (#f59e0b)
```

## Responsive Breakpoints

### Desktop (1200px+)
```
┌─────────────────────────────────────────┐
│  Canvas (60%)  │  Preview (40%)         │
│  3-col grid    │  Full height           │
└─────────────────────────────────────────┘
```

### Tablet (768px - 1199px)
```
┌─────────────────────────────────────────┐
│  Canvas (55%)  │  Preview (45%)         │
│  2-col grid    │  Narrower              │
└─────────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌─────────────────────┐
│  Canvas             │
│  1-col grid         │
├─────────────────────┤
│  Preview            │
│  (below canvas)     │
└─────────────────────┘
```

## Animation Timeline

### Modal Opening (300ms)
```
0ms:   opacity: 0, translateY(30px)
150ms: opacity: 0.5, translateY(15px)
300ms: opacity: 1, translateY(0)
```

### Card Selection (300ms)
```
0ms:   Checkmark scale: 0
150ms: Checkmark scale: 1.2
300ms: Checkmark scale: 1
```

### Bob Response Sections (500ms each, staggered)
```
Section 1: 0ms delay
Section 2: 100ms delay
Section 3: 200ms delay

Each section:
0ms:   opacity: 0, translateX(-10px)
500ms: opacity: 1, translateX(0)
```

## Guest Mode UI

### Logged In User
```
┌─────────────────────────────────┐
│  [Markdown Content]             │
│                                 │
│  ─────────────────────────────  │
│  [  Send to Bob 🤖  ]          │  ← Enabled, clickable
└─────────────────────────────────┘
```

### Guest User
```
┌─────────────────────────────────┐
│  [Markdown Content]             │
│                                 │
│  ─────────────────────────────  │
│  [🔒 Sign up to send to Bob]   │  ← Disabled, shows lock
└─────────────────────────────────┘
```

## Error States

### API Error
```
┌─────────────────────────────────┐
│  ⚠️ Failed to connect to Bob    │
│  Make sure the server is        │
│  running on port 3001           │
└─────────────────────────────────┘
```

### Empty Notebook
```
┌──────────────────────┐
│  📚 Empty Notebook   │
│  0 notes             │
└──────────────────────┘
   ↑ Still clickable but shows
     "No content to review"
```

## Keyboard Navigation

```
Key         Action
───         ──────
ESC         Close modal
Tab         Navigate between cards
Enter       Select focused card
Space       Select focused card
```

## Loading States

### Sending to Bob
```
Button text changes:
"Send to Bob" → "Sending to Bob..." → "Send to Bob"

Visual indicator:
Spinner or pulsing animation on button
```

### Parsing Response
```
Response area shows:
"Bob is analyzing your notes..."
   ↓
Sections fade in one by one
```

## Accessibility Features

### Screen Reader Announcements
```
"Practice Map opened"
"Personal notebook selected, 3 notes"
"Sending to Bob"
"Bob's response received"
```

### Focus Management
```
Modal opens → Focus on first card
Card selected → Focus on preview
Response received → Focus on first section
Modal closes → Focus returns to trigger button
```

## Best Practices Visualization

### Good Selection Pattern
```
Week 1: Select "Training" notebook → Get holistic feedback
Week 2: Select specific "Technique" note → Get focused advice
Week 3: Select "Training" notebook → See progress
```

### Content Organization
```
Notebook: "Basketball Training"
├── Page: "Shooting Practice - Week 1"
├── Page: "Shooting Practice - Week 2"
├── Page: "Shooting Practice - Week 3"
└── Page: "Shooting Practice - Week 4"

Select parent → See progression over time
Select child → Focus on specific week
```

---

**Visual Guide Complete!** 🎨

Use this guide to understand the layout, interactions, and visual design of the Practice Map feature.