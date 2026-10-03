-- Fullstack Website — MySQL schema + sample data (safe to re-run: does not drop existing data)
-- Login: admin@example.com / password   (also john@example.com / password)

CREATE DATABASE IF NOT EXISTS fullstack_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fullstack_website;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    user_id INT NULL,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    status ENUM('pending', 'processing', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample users (password for both: "password")
INSERT IGNORE INTO users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('John Doe',   'john@example.com',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

-- Sample products (only inserted when the table is empty)
INSERT INTO products (name, price, description)
SELECT * FROM (
    SELECT 'Wireless Mouse' AS name, 15.99 AS price, 'Ergonomic wireless mouse with USB receiver.' AS description
    UNION ALL SELECT 'Mechanical Keyboard', 49.99, 'RGB backlit mechanical keyboard.'
    UNION ALL SELECT 'USB-C Hub', 24.99, '7-in-1 USB-C hub with HDMI and card reader.'
) t WHERE NOT EXISTS (SELECT 1 FROM products);

-- Sample orders spread over the last days so charts have data (only when table is empty)
INSERT INTO orders (customer_name, user_id, total, status, created_at)
SELECT * FROM (
    SELECT 'John Doe' AS customer_name, 2 AS user_id, 65.98 AS total, 'completed' AS status, DATE_SUB(NOW(), INTERVAL 12 DAY) AS created_at
    UNION ALL SELECT 'Jane Smith', NULL, 24.99, 'pending',    DATE_SUB(NOW(), INTERVAL 10 DAY)
    UNION ALL SELECT 'Sokha',      1,    49.99, 'completed',  DATE_SUB(NOW(), INTERVAL 8 DAY)
    UNION ALL SELECT 'Dara',       1,    31.98, 'completed',  DATE_SUB(NOW(), INTERVAL 6 DAY)
    UNION ALL SELECT 'Sreymom',    2,    90.97, 'processing', DATE_SUB(NOW(), INTERVAL 5 DAY)
    UNION ALL SELECT 'Vibol',      1,    15.99, 'cancelled',  DATE_SUB(NOW(), INTERVAL 4 DAY)
    UNION ALL SELECT 'Sokha',      1,    74.98, 'completed',  DATE_SUB(NOW(), INTERVAL 3 DAY)
    UNION ALL SELECT 'Chantha',    2,    49.99, 'completed',  DATE_SUB(NOW(), INTERVAL 2 DAY)
    UNION ALL SELECT 'Dara',       1,    40.98, 'pending',    DATE_SUB(NOW(), INTERVAL 1 DAY)
    UNION ALL SELECT 'Bopha',      2,    115.96,'completed',  NOW()
) t WHERE NOT EXISTS (SELECT 1 FROM orders);
