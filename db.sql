CREATE TABLE users (
	user_id INT ALWAYS GENERATED AS IDENTITY, 
	user_name VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
	user_email VARCHAR(255) NOT NULL,
	walletAddress VARCHAR(255) NOT NULL,
	PRIMARY KEY (user_id)
	-- price_range INT NOT NULL check(price_range >= 1 and price_range <= 5),
	-- on_sale BOOLEAN
);
