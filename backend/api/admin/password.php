<?php
require_once __DIR__ . '/../../config/auth.php';

$auth = require_auth();
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') fail('Method not allowed.', 405);

$d = json_input();
$new = $d['new_password'] ?? '';
if (strlen($new) < 6) fail('ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច ៦ តួអក្សរ');

$db = db();
$s = $db->prepare('SELECT password FROM users WHERE id = :id');
$s->execute([':id' => $auth['id']]);
$row = $s->fetch();
if (!$row || !password_verify($d['current_password'] ?? '', $row['password'])) {
    fail('ពាក្យសម្ងាត់បច្ចុប្បន្នមិនត្រឹមត្រូវ');
}

$db->prepare('UPDATE users SET password = :p WHERE id = :id')->execute([':p' => password_hash($new, PASSWORD_DEFAULT), ':id' => $auth['id']]);
respond(['success' => true]);
