/*
  # Create Complete ComeUp-like Platform Schema

  1. New Tables
    - `profiles`
      - User profile information
      - Seller status, rating, statistics
      - Avatar, bio, skills, etc.
    
    - `services`
      - Service listings with multiple tiers
      - Category, pricing, delivery time
      - Features and descriptions
    
    - `service_packages`
      - Multiple pricing tiers per service (basic, standard, premium)
      - Different features and delivery times per package
    
    - `orders`
      - Complete order management
      - Status tracking (pending, in_progress, delivered, completed, cancelled)
      - Payment information
    
    - `order_messages`
      - Messages within order context
      - File attachments support
    
    - `conversations`
      - Direct messaging between users
      - Pre-order inquiries
    
    - `messages`
      - Individual messages in conversations
      - Read status tracking
    
    - `reviews`
      - Service reviews and ratings
      - Verified purchase reviews
    
    - `favorites`
      - Bookmarked services
    
    - `notifications`
      - System notifications for users
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Restrict access based on ownership
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  username text UNIQUE,
  avatar_url text,
  title text,
  description text,
  bio text,
  skills text[],
  languages text[],
  is_seller boolean DEFAULT false,
  level text DEFAULT 'Nouveau vendeur',
  rating numeric DEFAULT 0,
  review_count integer DEFAULT 0,
  orders_completed integer DEFAULT 0,
  response_time integer DEFAULT 24,
  on_time_delivery_rate integer DEFAULT 100,
  member_since timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  category_id text NOT NULL,
  category text NOT NULL,
  image_url text,
  gallery_urls text[],
  tags text[],
  rating numeric DEFAULT 0,
  review_count integer DEFAULT 0,
  orders_in_queue integer DEFAULT 0,
  total_sales integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  TO authenticated
  USING (is_active = true OR seller_id = auth.uid());

CREATE POLICY "Sellers can insert own services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Sellers can update own services"
  ON services FOR UPDATE
  TO authenticated
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Sellers can delete own services"
  ON services FOR DELETE
  TO authenticated
  USING (seller_id = auth.uid());

-- Service packages (multi-tier pricing)
CREATE TABLE IF NOT EXISTS service_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  tier text NOT NULL CHECK (tier IN ('basic', 'standard', 'premium')),
  description text,
  price integer NOT NULL,
  delivery_days integer NOT NULL,
  revisions integer DEFAULT 1,
  features text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active packages"
  ON service_packages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Sellers can manage own service packages"
  ON service_packages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM services
      WHERE services.id = service_packages.service_id
      AND services.seller_id = auth.uid()
    )
  );

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  package_id uuid REFERENCES service_packages(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'in_revision', 'delivered', 'completed', 'cancelled', 'dispute')),
  amount integer NOT NULL,
  commission integer NOT NULL,
  delivery_date timestamptz,
  requirements text,
  delivery_message text,
  delivery_files text[],
  cancellation_reason text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders as buyer"
  ON orders FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid());

CREATE POLICY "Sellers can view own orders as seller"
  ON orders FOR SELECT
  TO authenticated
  USING (seller_id = auth.uid());

CREATE POLICY "Buyers can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Buyers and sellers can update related orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (buyer_id = auth.uid() OR seller_id = auth.uid())
  WITH CHECK (buyer_id = auth.uid() OR seller_id = auth.uid());

-- Order messages
CREATE TABLE IF NOT EXISTS order_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  attachments text[],
  is_system_message boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order participants can view messages"
  ON order_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_messages.order_id
      AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid())
    )
  );

CREATE POLICY "Order participants can send messages"
  ON order_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_messages.order_id
      AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid())
    )
  );

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1 uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  participant_2 uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(participant_1, participant_2)
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (participant_1 = auth.uid() OR participant_2 = auth.uid());

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (participant_1 = auth.uid() OR participant_2 = auth.uid());

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  attachments text[],
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Conversation participants can view messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.participant_1 = auth.uid() OR conversations.participant_2 = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in own conversations"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.participant_1 = auth.uid() OR conversations.participant_2 = auth.uid())
    )
  );

CREATE POLICY "Users can mark messages as read"
  ON messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.participant_1 = auth.uid() OR conversations.participant_2 = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.participant_1 = auth.uid() OR conversations.participant_2 = auth.uid())
    )
  );

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL UNIQUE,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  response text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Buyers can create reviews for completed orders"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    reviewer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = reviews.order_id
      AND orders.buyer_id = auth.uid()
      AND orders.status = 'completed'
    )
  );

CREATE POLICY "Sellers can respond to reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());

-- Favorites
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, service_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  link text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_seller ON services(seller_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_reviews_service ON reviews(service_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, username)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'User'),
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
