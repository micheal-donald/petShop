# ER Diagram Improvement
Currently, a product is linked to one category.To allow for products to have multiple sub-categories: 
- Create a many-to-many relationship by introducing an associative table that connects products and sub-categories.
- Introduce a new table called product_categories with two foreign keys: product_id and subcategory_id.

![ER Diagram][def]

[def]: peShopERD.jpg

# Views showing orders for the current week
To display orders for the current week, you can create a view that filters orders based on the current week's date range. The following SQL query demonstrates how to create a view that shows orders placed within the current week:

[weeklyOrderView](./weeklyOrderView.sql)

# View where we can visualize a weekly report
To visualize a weekly report of orders, you can create a view that aggregates order data by week. The following SQL query demonstrates how to create a view that provides a weekly summary of orders:

[weeklyReportView](./weeklyReportView.sql)