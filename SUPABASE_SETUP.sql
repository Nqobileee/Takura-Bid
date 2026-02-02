 -- Supabase Schema Migration for Takura-Bid
-- This script will migrate your existing tables to the new schema

-- Step 1: Drop existing tables (this will cascade delete all data)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Step 2: Create new users table with auth_id
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('client', 'driver')),
  name TEXT NOT NULL,
  avatar TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_conversations_client_id ON conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_conversations_driver_id ON conversations(driver_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Enable Real Time for Supabase
-- Go to Database > Replication in Supabase dashboard and enable replication for:
-- - conversations
-- - messages
-- - users

-- Create RLS policies for security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile (direct auth_id comparison - no recursion)
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = auth_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = auth_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = auth_id);

-- Allow service role to bypass RLS for admin operations
CREATE POLICY "Service role full access" ON users
  FOR ALL USING (auth.role() = 'service_role');

-- Users can only see their own conversations
CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING (
    client_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    OR driver_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Users can only see messages from their conversations
CREATE POLICY "Users can view conversation messages" ON messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT c.id FROM conversations c
      WHERE c.client_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
         OR c.driver_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

-- Users can only insert messages in their conversations
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT c.id FROM conversations c
      WHERE c.client_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
         OR c.driver_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
    AND sender_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Users can only update messages they sent (for read status)
CREATE POLICY "Users can update their messages" ON messages
  FOR UPDATE USING (sender_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- =====================================================
-- CONVERSATION CREATION POLICIES
-- =====================================================

-- Clients can create conversations with drivers
CREATE POLICY "Clients can create conversations" ON conversations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.id = conversations.client_id
      AND users.type = 'client'
    )
  );

-- Drivers can also initiate conversations with clients
CREATE POLICY "Drivers can create conversations" ON conversations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.id = conversations.driver_id
      AND users.type = 'driver'
    )
  );

-- Allow users to view all drivers (for starting conversations)
CREATE POLICY "Users can view all drivers" ON users
  FOR SELECT USING (type = 'driver');

-- Allow users to view all clients (for starting conversations)
CREATE POLICY "Users can view all clients" ON users
  FOR SELECT USING (type = 'client');

-- =====================================================
-- ANALYTICS TABLES
-- =====================================================

-- Step 5: Create analytics_events table for tracking user activities
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'message_sent', 'message_received', 'conversation_started',
    'profile_view', 'profile_click', 'login', 'logout'
  )),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 6: Create user_stats table for aggregated statistics
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  total_messages_sent INTEGER DEFAULT 0,
  total_messages_received INTEGER DEFAULT 0,
  total_conversations INTEGER DEFAULT 0,
  profile_views INTEGER DEFAULT 0,
  profile_clicks INTEGER DEFAULT 0,
  avg_response_time_seconds INTEGER DEFAULT 0,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 7: Create daily_stats table for time-series analytics
CREATE TABLE IF NOT EXISTS daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stat_date DATE NOT NULL DEFAULT CURRENT_DATE,
  messages_sent INTEGER DEFAULT 0,
  messages_received INTEGER DEFAULT 0,
  conversations_started INTEGER DEFAULT 0,
  profile_views INTEGER DEFAULT 0,
  profile_clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, stat_date)
);

-- Create indexes for analytics tables
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_id ON daily_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(stat_date DESC);

-- Enable RLS for analytics tables
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- Users can only view their own analytics
CREATE POLICY "Users can view own analytics events" ON analytics_events
  FOR SELECT USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own analytics events" ON analytics_events
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can view own stats" ON user_stats
  FOR SELECT USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own stats" ON user_stats
  FOR UPDATE USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own stats" ON user_stats
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can view own daily stats" ON daily_stats
  FOR SELECT USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own daily stats" ON daily_stats
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own daily stats" ON daily_stats
  FOR UPDATE USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- =====================================================
-- FUNCTIONS FOR AUTO-UPDATING STATS
-- =====================================================

-- Function to initialize user stats when a user is created
CREATE OR REPLACE FUNCTION initialize_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user_stats
CREATE TRIGGER on_user_created
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_stats();

-- Function to update stats when a message is sent
CREATE OR REPLACE FUNCTION update_message_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update sender's sent count
  UPDATE user_stats 
  SET total_messages_sent = total_messages_sent + 1,
      last_active_at = NOW(),
      updated_at = NOW()
  WHERE user_id = NEW.sender_id;
  
  -- Update or insert daily stats for sender
  INSERT INTO daily_stats (user_id, stat_date, messages_sent)
  VALUES (NEW.sender_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, stat_date) 
  DO UPDATE SET messages_sent = daily_stats.messages_sent + 1;
  
  -- Get the other user in the conversation and update their received count
  UPDATE user_stats 
  SET total_messages_received = total_messages_received + 1,
      updated_at = NOW()
  WHERE user_id IN (
    SELECT CASE 
      WHEN client_id = NEW.sender_id THEN driver_id 
      ELSE client_id 
    END
    FROM conversations WHERE id = NEW.conversation_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for message stats
CREATE TRIGGER on_message_sent
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_message_stats();

-- Function to update conversation count
CREATE OR REPLACE FUNCTION update_conversation_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update both users' conversation counts
  UPDATE user_stats 
  SET total_conversations = total_conversations + 1,
      updated_at = NOW()
  WHERE user_id IN (NEW.client_id, NEW.driver_id);
  
  -- Update daily stats
  INSERT INTO daily_stats (user_id, stat_date, conversations_started)
  VALUES (NEW.client_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, stat_date) 
  DO UPDATE SET conversations_started = daily_stats.conversations_started + 1;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for conversation stats
CREATE TRIGGER on_conversation_created
  AFTER INSERT ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_stats();

-- =====================================================
-- PAYMENTS TABLE
-- =====================================================

-- Create payments table for transaction management
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  load_id UUID NOT NULL,
  payer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  fee_amount DECIMAL(10, 2) DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'ZWL')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'ecocash', 'innbucks', 'bank_transfer')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  reference TEXT UNIQUE NOT NULL,
  ecocash_number TEXT,
  bank_details JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for payments
CREATE INDEX IF NOT EXISTS idx_payments_payer_id ON payments(payer_id);
CREATE INDEX IF NOT EXISTS idx_payments_payee_id ON payments(payee_id);
CREATE INDEX IF NOT EXISTS idx_payments_load_id ON payments(load_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- Enable RLS for payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payments (as payer or payee)
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (
    payer_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    OR payee_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Users can create payments where they are the payer
CREATE POLICY "Users can create payments" ON payments
  FOR INSERT WITH CHECK (
    payer_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Users can update payments they are involved in (for status changes)
CREATE POLICY "Users can update payments" ON payments
  FOR UPDATE USING (
    payer_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    OR payee_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- =====================================================
-- SHIPMENT TRACKING TABLE
-- =====================================================

-- Create shipment tracking table for GPS data
CREATE TABLE IF NOT EXISTS shipment_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  load_id UUID UNIQUE NOT NULL,
  driver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  speed DECIMAL(6, 2),
  heading DECIMAL(5, 2),
  accuracy DECIMAL(8, 2),
  status TEXT NOT NULL DEFAULT 'pickup' CHECK (status IN ('pickup', 'in_transit', 'delivered', 'delayed')),
  origin_lat DECIMAL(10, 8),
  origin_lng DECIMAL(11, 8),
  origin_address TEXT,
  dest_lat DECIMAL(10, 8),
  dest_lng DECIMAL(11, 8),
  dest_address TEXT,
  total_distance DECIMAL(10, 2),
  distance_remaining DECIMAL(10, 2),
  distance_traveled DECIMAL(10, 2) DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for tracking
CREATE INDEX IF NOT EXISTS idx_tracking_load_id ON shipment_tracking(load_id);
CREATE INDEX IF NOT EXISTS idx_tracking_driver_id ON shipment_tracking(driver_id);
CREATE INDEX IF NOT EXISTS idx_tracking_status ON shipment_tracking(status);
CREATE INDEX IF NOT EXISTS idx_tracking_updated_at ON shipment_tracking(updated_at DESC);

-- Enable RLS for tracking
ALTER TABLE shipment_tracking ENABLE ROW LEVEL SECURITY;

-- Drivers can manage their own tracking data
CREATE POLICY "Drivers can manage own tracking" ON shipment_tracking
  FOR ALL USING (
    driver_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Clients can view tracking for their loads (would need load ownership check in production)
CREATE POLICY "Users can view tracking" ON shipment_tracking
  FOR SELECT USING (true);

-- =====================================================
-- ENHANCED MESSAGES TABLE FOR READ RECEIPTS
-- =====================================================

-- Add columns for read receipts and delivery status
ALTER TABLE messages ADD COLUMN IF NOT EXISTS delivered BOOLEAN DEFAULT FALSE;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE;

-- =====================================================
-- PROFILE TABLES
-- =====================================================

-- Driver profiles table
CREATE TABLE IF NOT EXISTS driver_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  phone TEXT,
  address TEXT,
  license_number TEXT,
  license_expiry DATE,
  vehicle_type TEXT DEFAULT 'Truck (7 tonnes)',
  vehicle_make TEXT,
  vehicle_year TEXT,
  license_plate TEXT,
  capacity DECIMAL(10, 2) DEFAULT 7,
  insurance_expiry DATE,
  bio TEXT,
  years_experience INTEGER DEFAULT 0,
  rate_per_km DECIMAL(10, 2) DEFAULT 1.85,
  specializations TEXT[] DEFAULT '{}',
  rating DECIMAL(3, 2) DEFAULT 4.5,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Client profiles table
CREATE TABLE IF NOT EXISTS client_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT,
  registration_number TEXT,
  vat_number TEXT,
  industry TEXT DEFAULT 'Manufacturing',
  company_size TEXT DEFAULT '1-10 employees',
  company_address TEXT,
  company_description TEXT,
  job_title TEXT,
  phone TEXT,
  alt_phone TEXT,
  website TEXT,
  billing_address TEXT,
  payment_method TEXT DEFAULT 'Bank Transfer',
  credit_limit DECIMAL(15, 2) DEFAULT 5000,
  preferred_currency TEXT DEFAULT 'USD - US Dollar',
  payment_terms TEXT DEFAULT 'Net 30 days',
  load_types TEXT[] DEFAULT '{}',
  rating DECIMAL(3, 2) DEFAULT 4.5,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('message', 'load', 'payment', 'system', 'bid')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for profile tables
CREATE INDEX IF NOT EXISTS idx_driver_profiles_user_id ON driver_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_client_profiles_user_id ON client_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Enable RLS for profile tables
ALTER TABLE driver_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can manage their own driver profile
CREATE POLICY "Users can manage own driver profile" ON driver_profiles
  FOR ALL USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can manage their own client profile  
CREATE POLICY "Users can manage own client profile" ON client_profiles
  FOR ALL USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can manage their own settings
CREATE POLICY "Users can manage own settings" ON user_settings
  FOR ALL USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can manage their own notifications
CREATE POLICY "Users can manage own notifications" ON notifications
  FOR ALL USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Allow public read of driver profiles (for clients browsing drivers)
CREATE POLICY "Public can view driver profiles" ON driver_profiles
  FOR SELECT USING (true);

-- Enable realtime for notifications
-- Go to Database > Replication and enable notifications table

-- =============================================
-- CALLS FEATURE - WebRTC Signaling Tables
-- =============================================

-- Calls table to store call records
CREATE TABLE IF NOT EXISTS calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  callee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  call_type TEXT NOT NULL CHECK (call_type IN ('audio', 'video')),
  status TEXT NOT NULL DEFAULT 'ringing' CHECK (status IN ('ringing', 'answered', 'ended', 'missed', 'declined')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answered_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Call signals table for WebRTC signaling
CREATE TABLE IF NOT EXISTS call_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  signal_type TEXT NOT NULL CHECK (signal_type IN ('offer', 'answer', 'ice-candidate', 'hangup')),
  signal_data TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for calls
CREATE INDEX IF NOT EXISTS idx_calls_caller_id ON calls(caller_id);
CREATE INDEX IF NOT EXISTS idx_calls_callee_id ON calls(callee_id);
CREATE INDEX IF NOT EXISTS idx_calls_conversation_id ON calls(conversation_id);
CREATE INDEX IF NOT EXISTS idx_calls_status ON calls(status);
CREATE INDEX IF NOT EXISTS idx_call_signals_call_id ON call_signals(call_id);
CREATE INDEX IF NOT EXISTS idx_call_signals_to_user_id ON call_signals(to_user_id);

-- Enable RLS for calls
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_signals ENABLE ROW LEVEL SECURITY;

-- Users can see calls they are part of
CREATE POLICY "Users can view their calls" ON calls
  FOR SELECT USING (
    caller_id IN (SELECT id FROM users WHERE auth_id = auth.uid()) OR
    callee_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Users can create calls
CREATE POLICY "Users can create calls" ON calls
  FOR INSERT WITH CHECK (
    caller_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Users can update calls they are part of
CREATE POLICY "Users can update their calls" ON calls
  FOR UPDATE USING (
    caller_id IN (SELECT id FROM users WHERE auth_id = auth.uid()) OR
    callee_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Users can view signals for their calls
CREATE POLICY "Users can view call signals" ON call_signals
  FOR SELECT USING (
    from_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()) OR
    to_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Users can send signals
CREATE POLICY "Users can send call signals" ON call_signals
  FOR INSERT WITH CHECK (
    from_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Enable realtime for calls and call_signals
-- Go to Database > Replication and enable calls and call_signals tables