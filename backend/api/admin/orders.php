<?php
require_once __DIR__ . '/../../config/auth.php';

$auth = require_auth();
$db = db();
$id = (int) ($_GET['id'] ?? 0);
$statuses = ['pending', 'processing', 'completed', 'cancelled'];

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        respond($db->query(
            'SELECT o.id, o.customer_name, o.user_id, u.name AS user_name, o.total, o.status, o.created_at
             FROM orders o LEFT JOIN users u ON u.id = o.user_id
             ORDER BY o.id DESC'
        )->fetchAll());

    case 'POST':
        $d = json_input();
        $customer = trim($d['customer_name'] ?? '');
        $status = $d['status'] ?? 'pending';
        if ($customer === '' || !isset($d['total']) || !is_numeric($d['total']) || $d['total'] < 0) {
            fail('សូមបញ្ចូលអតិថិជន និងតម្លៃសរុបឲ្យត្រឹមត្រូវ');
        }
        if (!in_array($status, $statuses, true)) fail('ស្ថានភាពមិនត្រឹមត្រូវ');
        $db->prepare('INSERT INTO orders (customer_name, user_id, total, status, created_at) VALUES (:c, :u, :t, :s, NOW())')
           ->execute([':c' => $customer, ':u' => $auth['id'], ':t' => $d['total'], ':s' => $status]);
        respond(['success' => true, 'id' => $db->lastInsertId()], 201);

    case 'PUT':
        if (!$id) fail('Missing id');
        $d = json_input();
        $status = $d['status'] ?? '';
        if (!in_array($status, $statuses, true)) fail('ស្ថានភាពមិនត្រឹមត្រូវ');
        $db->prepare('UPDATE orders SET status = :s WHERE id = :id')->execute([':s' => $status, ':id' => $id]);
        respond(['success' => true]);

    case 'DELETE':
        if (!$id) fail('Missing id');
        $db->prepare('DELETE FROM orders WHERE id = :id')->execute([':id' => $id]);
        respond(['success' => true]);

    default:
        fail('Method not allowed.', 405);
}
