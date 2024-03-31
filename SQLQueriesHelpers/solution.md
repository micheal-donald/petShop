ER Diagram Improvement
To allow for products to have multiple sub-categories,  modify the existing database schema. Currently, a product is linked to one category.Create a many-to-many relationship by introducing an associative table that connects products and sub-categories.
Introduce a new table called product_categories with two foreign keys: product_id and subcategory_id.
