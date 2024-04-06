-- This view provides a weekly report with one column for each day of the week,
-- where each cell contains a concatenation of order_uuid, number of products,
-- and order amount in cents separated by a double colon.
CREATE OR REPLACE VIEW weekly_report AS
SELECT
  -- Aggregate data for each day of the week
  -- Each CASE statement checks for orders that match the specific day of the week
  -- and then formats the result as a concatenation of order_uuid, number of products, and order amount in cents
  -- separated by a double colon.

  MAX(CASE WHEN DAYOFWEEK(o.created_at) = 1 THEN 
    CONCAT(o.uuid, '::', COUNT(DISTINCT p.id), '::', SUM(p.price * 100)) END) AS 'Sunday',
  MAX(CASE WHEN DAYOFWEEK(o.created_at) = 2 THEN 
    CONCAT(o.uuid, '::', COUNT(DISTINCT p.id), '::', SUM(p.price * 100)) END) AS 'Monday',
  MAX(CASE WHEN DAYOFWEEK(o.created_at) = 3 THEN 
    CONCAT(o.uuid, '::', COUNT(DISTINCT p.id), '::', SUM(p.price * 100)) END) AS 'Tuesday',
  MAX(CASE WHEN DAYOFWEEK(o.created_at) = 4 THEN 
    CONCAT(o.uuid, '::', COUNT(DISTINCT p.id), '::', SUM(p.price * 100)) END) AS 'Wednesday',
  MAX(CASE WHEN DAYOFWEEK(o.created_at) = 5 THEN 
    CONCAT(o.uuid, '::', COUNT(DISTINCT p.id), '::', SUM(p.price * 100)) END) AS 'Thursday',
  MAX(CASE WHEN DAYOFWEEK(o.created_at) = 6 THEN 
    CONCAT(o.uuid, '::', COUNT(DISTINCT p.id), '::', SUM(p.price * 100)) END) AS 'Friday',
  MAX(CASE WHEN DAYOFWEEK(o.created_at) = 7 THEN 
    CONCAT(o.uuid, '::', COUNT(DISTINCT p.id), '::', SUM(p.price * 100)) END) AS 'Saturday'
FROM orders o
  JOIN order_details od ON o.id = od.order_id
  JOIN products p ON od.product_id = p.id
WHERE o.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL DAYOFWEEK(CURRENT_DATE) - 1 DAY)
  AND o.created_at <  DATE_SUB(CURRENT_DATE, INTERVAL DAYOFWEEK(CURRENT_DATE) - 1 DAY) + INTERVAL 1 WEEK
GROUP BY DATE_FORMAT(o.created_at, '%Y-%m-%d')
