# Event Visibility and Expiration Fix

## ✅ Changes Implemented

### 1. **User-Created Events Visible to All Users**
**File**: `src/utils/supabase.ts`

**Change**: User-created events now have `status: 'approved'` instead of `status: 'pending'`

**Before**:
```typescript
status: 'pending', // Events needed admin approval
```

**After**:
```typescript
status: 'approved', // Events visible to all users immediately
```

**Result**: When a user creates an event, it's immediately visible to all users on the website.

---

### 2. **Event Expiration Logic**
**Files**: 
- `src/utils/supabase.ts` - `getEvents()` function
- `src/components/EventsPage.tsx` - `loadEvents()` function

**Change**: Events now automatically expire after their specified date/time

**How it works**:
- Events with date/time in the past are filtered out
- Events with `date = 'TBD'` are kept (curated template events)
- Events with unparseable dates are kept (to avoid breaking template events)
- Expiration check happens both in `getEvents()` and `loadEvents()`

**Result**: Past events are automatically hidden from users.

---

### 3. **Curated Events Requirements**
**File**: `add-curated-events.sql`

**Change**: Added `is_curated: true` field to all curated events

**Before**:
```sql
INSERT INTO events (
  ...
  max_participants,
  created_at,
  updated_at
) VALUES
```

**After**:
```sql
INSERT INTO events (
  ...
  max_participants,
  is_curated,  -- Added this field
  created_at,
  updated_at
) VALUES
  ...
  true, -- is_curated
  NOW(),
  NOW()
```

**Result**: Curated events from SQL now have the same structure as user-created events, with `is_curated = true` to distinguish them.

---

## 🧪 Testing

### Test 1: User-Created Event Visibility
1. **Login** as a regular user
2. **Create an event** with all required fields
3. **Complete payment**
4. **Logout and login as a different user**
5. **Check events page** - the event should be visible

**Expected**: Event appears in the events list for all users

---

### Test 2: Event Expiration
1. **Create an event** with a past date (e.g., yesterday)
2. **Check events page** - event should NOT appear
3. **Create an event** with a future date
4. **Check events page** - event SHOULD appear

**Expected**: Only future events are shown, past events are hidden

---

### Test 3: Curated Events
1. **Run the updated SQL** (`add-curated-events.sql`) in Supabase
2. **Check events page** - curated events should appear
3. **Verify** they have `is_curated = true` in database

**Expected**: Curated events appear with all required fields

---

## 📝 Database Verification

### Check User-Created Events:
```sql
SELECT 
  title,
  status,
  date,
  time,
  is_curated,
  created_by
FROM events 
WHERE is_curated = false
ORDER BY created_at DESC
LIMIT 10;
```

**Expected**: All user-created events have `status = 'approved'` and `is_curated = false`

### Check Curated Events:
```sql
SELECT 
  title,
  status,
  date,
  time,
  is_curated
FROM events 
WHERE is_curated = true
ORDER BY created_at DESC;
```

**Expected**: All curated events have `status = 'approved'` and `is_curated = true`

### Check Expired Events:
```sql
SELECT 
  title,
  date,
  time,
  CASE 
    WHEN date = 'TBD' THEN 'Template'
    WHEN date::date < CURRENT_DATE THEN 'Expired'
    ELSE 'Active'
  END as status
FROM events 
WHERE status = 'approved'
ORDER BY date DESC;
```

---

## 🔍 Console Logs

### When Creating Event:
```
🚀 Creating event with data: { title: "...", status: "approved", ... }
✅ Event created successfully: { id: "...", status: "approved" }
```

### When Loading Events:
```
📦 Raw events from database: X
⏰ After expiration filter: Y events
✅ Final events: [...]
```

### When Event Expires:
```
⏰ Filtering out expired event: "Event Title" - Date: 25/11/2024 10:00 AM
```

---

## 🚨 Important Notes

1. **User-Created Events**: Now immediately visible to all users (no admin approval needed)
2. **Event Expiration**: Events automatically expire after their date/time
3. **Curated Events**: Template events with `date = 'TBD'` never expire
4. **Database Update**: If you've already run the old SQL, you may need to update existing curated events:

```sql
-- Update existing curated events to include is_curated field
UPDATE events 
SET is_curated = true 
WHERE title IN (
  'Paddle Pickle 🥪',
  'Karaoke Nights 🎤',
  'Run Clubs / Morning Runs 🏃',
  -- ... other curated event titles
)
AND is_curated IS NULL;
```

---

## Files Changed
- `src/utils/supabase.ts` - Changed event status to 'approved', added expiration filter
- `src/components/EventsPage.tsx` - Enhanced expiration filtering
- `add-curated-events.sql` - Added `is_curated` field to all events

All three requirements are now implemented! 🎉
