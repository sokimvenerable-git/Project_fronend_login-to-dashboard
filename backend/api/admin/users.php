<?php
require_once __DIR__ . '/../../config/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$auth = require_auth($method !== 'GET'); // reading: any user, writing: admin only
$db = db();
$id = (int) ($_GET['id'] ?? 0);

function email_taken($db, $email, $exceptId = 0)
{
    $s = $db->prepare('SELECT id FROM users WHERE email = :e AND id <> :id');
    $s->execute([':e' => $email, ':id' => $exceptId]);
    return (bool) $s->fetch();
}

switch ($method) {
    case 'GET':
        respond($db->query('SELECT id, name, email, role, created_at FROM users ORDER BY id DESC')->fetchAll());

    case 'POST':
        $d = json_input();
        $name = trim($d['name'] ?? '');
        $email = strtolower(trim($d['email'] ?? ''));
        $role = ($d['role'] ?? 'user') === 'admin' ? 'admin' : 'user';
        if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) fail('សូមបញ្ចូលឈ្មោះ និងអ៊ីមែលឲ្យត្រឹមត្រូវ');
        if (strlen($d['password'] ?? '') < 6) fail('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ');
        if (email_taken($db, $email)) fail('អ៊ីមែលនេះមានរួចហើយ', 409);
        $db->prepare('INSERT INTO users (name, email, password, role, created_at) VALUES (:n, :e, :p, :r, NOW())')
           ->execute([':n' => $name, ':e' => $email, ':p' => password_hash($d['password'], PASSWORD_DEFAULT), ':r' => $role]);
        respond(['success' => true, 'id' => $db->lastInsertId()], 201);

    case 'PUT':
        if (!$id) fail('Missing id');
        $d = json_input();
        $name = trim($d['name'] ?? '');
        $email = strtolower(trim($d['email'] ?? ''));
        $role = ($d['role'] ?? 'user') === 'admin' ? 'admin' : 'user';
        if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) fail('សូមបញ្ចូលឈ្មោះ និងអ៊ីមែលឲ្យត្រឹមត្រូវ');
        if (email_taken($db, $email, $id)) fail('អ៊ីមែលនេះមានរួចហើយ', 409);
        if (!empty($d['password'])) {
            if (strlen($d['password']) < 6) fail('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ');
            $db->prepare('UPDATE users SET name=:n, email=:e, role=:r, password=:p WHERE id=:id')
               ->execute([':n' => $name, ':e' => $email, ':r' => $role, ':p' => password_hash($d['password'], PASSWORD_DEFAULT), ':id' => $id]);
        } else {
            $db->prepare('UPDATE users SET name=:n, email=:e, role=:r WHERE id=:id')
               ->execute([':n' => $name, ':e' => $email, ':r' => $role, ':id' => $id]);
        }
        respond(['success' => true]);

    case 'DELETE':
        if (!$id) fail('Missing id');
        if ($id === (int) $auth['id']) fail('មិនអាចលុបគណនីខ្លួនឯងបានទេ');
        $db->prepare('DELETE FROM users WHERE id = :id')->execute([':id' => $id]);
        respond(['success' => true]);

    default:
        fail('Method not allowed.', 405);
}
