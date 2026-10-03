<?php
require_once __DIR__ . '/../../config/auth.php';

require_auth();
$db = db();

// Sales trend: last 14 days (cancelled orders excluded), zero-filled
$rows = $db->query(
    "SELECT DATE(created_at) AS d, SUM(total) AS t FROM orders
     WHERE status <> 'cancelled' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 13 DAY)
     GROUP BY DATE(created_at)"
)->fetchAll();
$byDate = [];
foreach ($rows as $r) $byDate[$r['d']] = (float) $r['t'];

$trend = [];
for ($i = 13; $i >= 0; $i--) {
    $date = date('Y-m-d', strtotime("-{$i} days"));
    $trend[] = ['date' => date('d/m', strtotime($date)), 'total' => $byDate[$date] ?? 0];
}

// Monthly revenue: last 6 months
$mRows = $db->query(
    "SELECT DATE_FORMAT(created_at, '%Y-%m') AS m, SUM(total) AS t FROM orders
     WHERE status <> 'cancelled' AND created_at >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 5 MONTH)
     GROUP BY m"
)->fetchAll();
$byMonth = [];
foreach ($mRows as $r) $byMonth[$r['m']] = (float) $r['t'];
$monthly = [];
for ($i = 5; $i >= 0; $i--) {
    $key = date('Y-m', strtotime(date('Y-m-01') . " -{$i} months"));
    $monthly[] = ['month' => $key, 'total' => $byMonth[$key] ?? 0];
}

$status = array_map(fn($r) => ['status' => $r['status'], 'count' => (int) $r['count']],
    $db->query('SELECT status, COUNT(*) AS count FROM orders GROUP BY status')->fetchAll());

$top = array_map(fn($r) => ['customer' => $r['customer_name'], 'orders' => (int) $r['orders'], 'total' => (float) $r['total']],
    $db->query("SELECT customer_name, COUNT(*) AS orders, SUM(total) AS total FROM orders
                WHERE status <> 'cancelled' GROUP BY customer_name ORDER BY total DESC LIMIT 5")->fetchAll());

$s = $db->query("SELECT COALESCE(SUM(total),0) AS revenue, COUNT(*) AS orders FROM orders WHERE status <> 'cancelled'")->fetch();
$totalOrders = (int) $db->query('SELECT COUNT(*) FROM orders')->fetchColumn();
$revenue = (float) $s['revenue'];
$valid = (int) $s['orders'];

respond([
    'sales_trend' => $trend,
    'monthly' => $monthly,
    'status_breakdown' => $status,
    'top_customers' => $top,
    'summary' => [
        'total_revenue' => $revenue,
        'total_orders' => $totalOrders,
        'avg_order_value' => $valid > 0 ? round($revenue / $valid, 2) : 0,
    ],
]);
