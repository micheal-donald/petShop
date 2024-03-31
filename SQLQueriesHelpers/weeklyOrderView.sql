-- This view will include orders from the current week, with details about products, clients, payments, and order status.
-- The current week is assumed to start on Sunday and end on Saturday.
CREATE OR REPLACE VIEW weekly_orders AS
SELECT
  -- Order details
  o.uuid AS order_uuid,
  -- Concatenation of first and last name for client's full name
  CONCAT(u.first_name, ' ', u.last_name) AS client_name,
  -- Payment type from the payments table
  pay.type AS payment_type,
  -- Order status title from the order_statuses table
  os.title AS status,
  -- Count of products in the order
  COUNT(p.id) AS number_of_products,
  -- Sum of product prices to get the total order amount
  SUM(p.price) AS order_amount
FROM orders o
  -- Join with users to get client information
  JOIN users u ON o.user_id = u.id
  -- Join with payments to get payment information
  JOIN payments pay ON o.payment_id = pay.id
  -- Join with order_statuses to get the order status
  JOIN order_statuses os ON o.order_status_id = os.id
  -- Join with a table that links orders to products (assumed to be order_details or similar)
  JOIN order od ON o.id = od.order_id
  -- Join with products to get product information
  JOIN products p ON od.product_id = p.id
-- Filter for the current week's orders based on created_at
-- Assuming the week starts on Sunday, adjust as needed for different locales
WHERE o.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL DAYOFWEEK(CURRENT_DATE) - 1 DAY)
  AND o.created_at <  DATE_SUB(CURRENT_DATE, INTERVAL DAYOFWEEK(CURRENT_DATE) - 1 DAY) + INTERVAL 1 WEEK
-- Group by order to aggregate product counts and prices
GROUP BY o.id;
