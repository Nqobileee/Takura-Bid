-- Run this in Supabase SQL Editor to fix the infinite recursion error

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view conversation members" ON users;
DROP POLICY IF EXISTS "Service role full access" ON users;
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view conversation messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update their messages" ON messages;
DROP POLICY IF EXISTS "Clients can create conversations" ON conversations;
DROP POLICY IF EXISTS "Drivers can create conversations" ON conversations;

-- Recreate users policies (no recursion - direct auth_id check)
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = auth_id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = auth_id);

-- Allow viewing all users (needed for chat to find drivers/clients)
CREATE POLICY "Users can view all users" ON users
  FOR SELECT USING (true);

-- Conversations policies
CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING (
    client_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    OR driver_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Clients can create conversations" ON conversations
  FOR INSERT WITH CHECK (
    client_id IN (SELECT id FROM users WHERE auth_id = auth.uid() AND type = 'client')
  );

CREATE POLICY "Drivers can create conversations" ON conversations
  FOR INSERT WITH CHECK (
    driver_id IN (SELECT id FROM users WHERE auth_id = auth.uid() AND type = 'driver')
  );

-- Messages policies
CREATE POLICY "Users can view conversation messages" ON messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT c.id FROM conversations c
      WHERE c.client_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
         OR c.driver_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT c.id FROM conversations c
      WHERE c.client_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
         OR c.driver_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
    AND sender_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Users can update their messages" ON messages
  FOR UPDATE USING (sender_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));
