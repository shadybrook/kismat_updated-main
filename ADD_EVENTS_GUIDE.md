# Guide: Adding Curated Events to Kismat

## Overview

This guide explains how to add the 12 curated events to your Kismat application. These events will be visible to all users once added.

## Method: Using SQL (Recommended)

Using SQL is the **best approach** because:
- ✅ Events are immediately available to all users
- ✅ No need to create them through admin account
- ✅ Can add multiple events at once
- ✅ Easy to modify or add more events later

## Step-by-Step Instructions

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/zgwcqyfeixtzriyujvdf/sql/new
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New query"**

### Step 2: Run the SQL Script

1. Open the file `add-curated-events.sql` in your project
2. **Copy the entire contents** of the file
3. **Paste it into the Supabase SQL Editor**
4. Click **"Run"** (or press `Cmd+Enter` on Mac / `Ctrl+Enter` on Windows)

### Step 3: Verify Events Were Created

After running the script, you should see:
- A success message: `✅ Curated events created!`
- A count showing `total_events: 12` and `approved_events: 12`
- A list of all 12 events with their details

### Step 4: Test in Your App

1. **Refresh your app** at `http://localhost:3001`
2. **Log in** or **create a new account**
3. **Navigate to the Events page**
4. You should see all 12 curated events listed!

## Events Added

The following 12 events will be added:

1. **Paddle Pickle 🥪** - Sports category
2. **Karaoke Nights 🎤** - Entertainment category
3. **Run Clubs / Morning Runs 🏃** - Fitness category
4. **Cycling 🚴** - Fitness category
5. **Board Game Nights 🎲** - Social category
6. **Dinners 🍽️** - Food & Dining category
7. **Sport Screenings 🏆** - Entertainment category
8. **Concerts 🎵** - Entertainment category
9. **Cafe Hopping 📸** - Food & Dining category
10. **Beach Clean Up Events 🌊** - Community Service category
11. **Arcade Night 🎮** - Entertainment category
12. **Meet and Do Nothing 😌** - Social category

## Event Details

All events are configured with:
- **Status**: `approved` (visible to all users)
- **Price**: ₹150 per person
- **City**: Mumbai (you can modify this in the SQL)
- **Spots**: Varies by event (4-30 spots)
- **Creator Paid**: `true` (so events are ready to join)

## Customizing Events

### To Change the City

If you want events in a different city, modify the SQL:

```sql
-- Change 'Mumbai' to your desired city
city = 'Delhi',  -- or 'Bangalore', 'Pune', etc.
```

### To Add Events for Multiple Cities

You can duplicate the INSERT statements and change the `city` value for each set of events.

### To Modify Event Details

Edit the SQL file and change:
- `title` - Event name
- `description` - Event description
- `category` - Event category
- `total_spots` - Maximum participants
- `min_participants` - Minimum required
- `max_participants` - Maximum allowed

## Alternative: Using Admin Account

If you prefer to create events through the admin interface:

1. **Log in** with your admin account (`findyourkismat@gmail.com`)
2. **Navigate to Admin Dashboard**
3. **Create events** one by one through the UI
4. **Approve each event** so they're visible to users

**Note**: This method is slower and requires manual approval of each event.

## Troubleshooting

### Events Not Showing?

1. **Check event status**: Events must have `status = 'approved'` to be visible
2. **Check city match**: Events are filtered by user's city in profile
3. **Check RLS policies**: Ensure Row Level Security allows viewing approved events
4. **Refresh the app**: Hard refresh (`Cmd+Shift+R` or `Ctrl+Shift+R`)

### SQL Errors?

- Make sure the `events` table exists (run `create-profiles-table.sql` first if needed)
- Check that all required fields are provided
- Verify you're using the correct Supabase project

## Next Steps

After adding events:
1. ✅ Test that events appear for new users
2. ✅ Test that events appear for existing users
3. ✅ Verify users can join events
4. ✅ Consider adding events for other cities if needed

## Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Check Supabase logs in the dashboard
3. Verify the events table structure matches the SQL
