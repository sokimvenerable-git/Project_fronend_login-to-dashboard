<?php
require_once __DIR__ . '/config/cors.php';

echo json_encode([
    'message' => 'Fullstack Website API',
    'status' => 'running',
    'endpoints' => [
        'auth' => ['/api/auth/login.php', '/api/auth/register.php'],
        'admin' => [
            '/api/admin/stats.php', '/api/admin/reports.php', '/api/admin/users.php',
            '/api/admin/products.php', '/api/admin/orders.php',
            '/api/admin/profile.php', '/api/admin/password.php',
        ],
        'test' => '/api/test.php',
    ],
]);
