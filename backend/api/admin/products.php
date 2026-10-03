<?php
require_once __DIR__ . '/../../config/auth.php';

require_auth();
$db = db();
$id = (int) ($_GET['id'] ?? 0);

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        respond($db->query('SELECT id, name, price, description, created_at FROM products ORDER BY id DESC')->fetchAll());

    case 'POST':
    case 'PUT':
        $d = json_input();
        $name = trim($d['name'] ?? '');
        if ($name === '' || !isset($d['price']) || !is_numeric($d['price']) || $d['price'] < 0) {
            fail('សូមបញ្ចូលឈ្មោះ និងតម្លៃឲ្យត្រឹមត្រូវ');
        }
        $params = [':name' => $name, ':price' => $d['price'], ':description' => trim($d['description'] ?? '')];
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $db->prepare('INSERT INTO products (name, price, description, created_at) VALUES (:name, :price, :description, NOW())')->execute($params);
            respond(['success' => true, 'id' => $db->lastInsertId()], 201);
        }
        if (!$id) fail('Missing id');
        $params[':id'] = $id;
        $db->prepare('UPDATE products SET name = :name, price = :price, description = :description WHERE id = :id')->execute($params);
        respond(['success' => true]);

    case 'DELETE':
        if (!$id) fail('Missing id');
        $db->prepare('DELETE FROM products WHERE id = :id')->execute([':id' => $id]);
        respond(['success' => true]);

    default:
        fail('Method not allowed.', 405);
}
