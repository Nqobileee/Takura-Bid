# Messaging System Setup Guide

## Overview
Your messaging system is now fully refactored with:
- ✅ Real authentication with Supabase Auth
- ✅ Optimized real-time messaging (per-conversation subscriptions)
- ✅ Seamless message updates without full refetch
- ✅ Proper user context (no hard-coded IDs)
- ✅ Security with RLS policies

## What Changed

### 1. **Authentication Context** (`src/contexts/AuthContext.tsx`)
- Handles user login/signup
- Manages auth state globally
- Auto-syncs with Supabase Auth
- Provides `useAuth()` hook for components

### 2. **Message Service** (`src/services/messageService.ts`)
- Centralized messaging logic
- Optimized real-time listeners (per-conversation, not global)
- Methods:
  - `fetchConversations()` - Get all user conversations
  - `fetchMessages()` - Get specific conversation messages
  - `sendMessage()` - Send and return new message
  - `markAsRead()` - Mark messages as read
  - `subscribeToMessages()` - Listen for new messages in real-time
  - `getOrCreateConversation()` - Start new conversation

### 3. **Updated Chat Pages**
- Both driver and client chat pages now use:
  - `useAuth()` hook for current user
  - `messageService` for all operations
  - Optimized state management
  - Real-time subscriptions per conversation

## Setup Steps

### Step 1: Set Up Supabase Tables
1. Go to [Supabase Dashboard](https://supabase.com)
2. Select your project
3. Go to **SQL Editor** tab
4. Create a new query
5. Copy the entire content from `SUPABASE_SETUP.sql`
6. Paste and run it
7. Enable Real Time for tables: Go to **Database > Replication** and toggle `conversations` and `messages`

### Step 2: Set Environment Variables
Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Get these from Supabase: **Settings > API** > Copy the values

### Step 3: Test the System

#### For Driver:
1. Go to `/driver/chat`
2. If not logged in, you'll see loading (auth context will prompt login)
3. Once logged in, conversations load
4. Select a conversation to chat
5. Messages update in real-time

#### For Client:
1. Go to `/client/chat`
2. Same flow as driver

## How It Works

### Message Flow
```
User sends message
    ↓
messageService.sendMessage()
    ↓
Supabase inserts to 'messages' table
    ↓
Real-time listener triggers (subscribeToMessages)
    ↓
Component updates UI with new message
    ↓
Both users see message instantly
```

### Key Features

**Real-time Updates:**
- Uses Supabase Postgres Changes
- Per-conversation subscriptions (efficient)
- Separate channels for messages and updates
- Auto-cleans up subscriptions on unmount

**Authentication:**
- Uses Supabase Auth (email/password)
- User profile stored in `users` table
- Auth state persists across refreshes
- `useAuth()` hook for easy access

**Security:**
- Row-Level Security (RLS) policies
- Users can only see their conversations
- Users can only send messages in their conversations
- All queries filtered by user ID

## Common Issues & Fixes

### "Conversations not loading"
- Check auth context is working: Open DevTools > Network > check for auth calls
- Verify user is logged in: Add console.log in useAuth hook
- Check Supabase connection: Verify env variables

### "Messages not updating in real-time"
- Verify Real Time is enabled in Supabase
- Check browser console for subscription errors
- Ensure conversation ID is correct

### "Can't send messages"
- Verify user is logged in
- Check RLS policies are set correctly
- Ensure sender_id matches authenticated user

## Next Steps

1. **Add presence tracking** - See who's online
   - Use Supabase Realtime presence feature
   - Update `isOnline` status dynamically

2. **Add typing indicators** - Show when users are typing
   - Create a separate `typing` channel
   - Broadcast user typing events

3. **Add message reactions** - Let users react with emojis
   - Add `reactions` column to messages table
   - Create reaction management UI

4. **Add file sharing** - Send images/files
   - Integrate with Supabase Storage
   - Upload files and store reference in message

## File Structure
```
src/
├── contexts/
│   └── AuthContext.tsx          # Auth provider & hook
├── services/
│   └── messageService.ts        # Messaging logic
├── app/
│   ├── layout.tsx               # Wrapped with AuthProvider
│   ├── driver/chat/page.tsx      # Refactored with auth + service
│   └── client/chat/page.tsx      # Refactored with auth + service
└── lib/
    └── supabase.ts              # Supabase client setup
```

## Env Variables Checklist
- [ ] NEXT_PUBLIC_SUPABASE_URL set
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY set
- [ ] Supabase tables created
- [ ] Real Time enabled for tables
- [ ] RLS policies applied
- [ ] Can create auth users in Supabase dashboard

Your messaging system is now production-ready! 🚀
