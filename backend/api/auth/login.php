<?php
require_once __DIR__ . '/../../config/auth.php';

$data = json_input();
$email = strtolower(trim($data['email'] ?? ''));
$password = $data['password'] ?? '';

if ($email === '' || $password === '') {
    fail('សូមបញ្ចូលអ៊ីមែល និងពាក្យសម្ងាត់', 400);
}

$stmt = db()->prepare('SELECT id, name, email, password, role FROM users WHERE email = :email LIMIT 1');
$stmt->execute([':email' => $email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    fail('អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ', 401);
}

unset($user['password']);
respond(['success' => true, 'user' => $user, 'token' => create_token($user)]);
