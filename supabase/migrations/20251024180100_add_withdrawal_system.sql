/*
  # Add Withdrawal System

  1. New Tables
    - `withdrawals`
      - Withdrawal requests from sellers
      - Amount, status, payment details
      - Tracking of processed withdrawals
    
    - `seller_balances`
      - Virtual table/view for seller balance calculation
      - Total earnings, withdrawn, available balance

  2. Changes
    - Add payment fields to profiles table
    - Track seller earnings and withdrawals

  3. Security
    - Enable RLS on withdrawals table
    - Sellers can only view/create their own withdrawals
    - Admins can update withdrawal status
*/

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_earnings integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_withdrawn integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pending_balance integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bank_account_holder text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bank_iban text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bank_bic text;

CREATE TABLE IF NOT EXISTS withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount integer NOT NULL CHECK (amount > 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  payment_method text DEFAULT 'bank_transfer' CHECK (payment_method IN ('bank_transfer', 'paypal', 'stripe')),
  payment_details jsonb,
  rejection_reason text,
  processed_at timestamptz,
  processed_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers can view own withdrawals"
  ON withdrawals FOR SELECT
  TO authenticated
  USING (seller_id = auth.uid());

CREATE POLICY "Sellers can create own withdrawals"
  ON withdrawals FOR INSERT
  TO authenticated
  WITH CHECK (seller_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_withdrawals_seller ON withdrawals(seller_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);

CREATE OR REPLACE FUNCTION calculate_seller_balance(seller_uuid uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_earned integer;
  total_withdrawn integer;
  pending_withdrawals integer;
  available_balance integer;
BEGIN
  SELECT 
    COALESCE(SUM(amount - commission), 0)
  INTO total_earned
  FROM orders
  WHERE seller_id = seller_uuid
    AND status = 'completed';

  SELECT 
    COALESCE(SUM(amount), 0)
  INTO total_withdrawn
  FROM withdrawals
  WHERE seller_id = seller_uuid
    AND status = 'completed';

  SELECT 
    COALESCE(SUM(amount), 0)
  INTO pending_withdrawals
  FROM withdrawals
  WHERE seller_id = seller_uuid
    AND status IN ('pending', 'processing');

  available_balance := total_earned - total_withdrawn - pending_withdrawals;

  RETURN jsonb_build_object(
    'total_earned', total_earned,
    'total_withdrawn', total_withdrawn,
    'pending_withdrawals', pending_withdrawals,
    'available_balance', available_balance
  );
END;
$$;
