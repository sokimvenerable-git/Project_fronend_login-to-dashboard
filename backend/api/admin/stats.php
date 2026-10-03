<?php
require_once __DIR__ . '/../../config/auth.php';

require_auth();
$db = db();

$sum = $db->query("SELECT COALESCE(SUM(total),0) AS revenue, COUNT(*) AS orders FROM orders WHERE status <> 'cancelled'")->fetch();

respond([
    'total_sales' => (float) $sum['revenue'],
    'total_orders' => (int) $db->query('SELECT COUNT(*) FROM orders')->fetchColumn(),
    'total_users' => (int) $db->query('SELECT COUNT(*) FROM users')->fetchColumn(),
    'total_products' => (int) $db->query('SELECT COUNT(*) FROM products')->fetchColumn(),
    'recent_orders' => $db->query('SELECT id, customer_name, total, status, created_at FROM orders ORDER BY created_at DESC, id DESC LIMIT 6')->fetchAll(),
]);
