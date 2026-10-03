<?php
require_once __DIR__ . '/../../config/auth.php';

$data = json_input();
$name = trim($data['name'] ?? '');
$email = strtolower(trim($data['email'] ?? ''));
$password = $data['password'] ?? '';

if ($name === '' || $email === '' || $password === '') {
    fail('សូមបំពេញឈ្មោះ អ៊ីមែល និងពាក្យសម្ងាត់');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail('អ៊ីមែលមិនត្រឹមត្រូវ');
}
if (strlen($password) < 6) {
    fail('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ');
}

$db = db();
$check = $db->prepare('SELECT id FROM users WHERE email = :email');
$check->execute([':email' => $email]);
if ($check->fetch()) {
    fail('អ៊ីមែលនេះមានគេប្រើរួចហើយ', 409);
}

// Public registration always creates a normal 'user' (never admin).
$stmt = $db->prepare("INSERT INTO users (name, email, password, role, created_at) VALUES (:name, :email, :password, 'user', NOW())");
$stmt->execute([':name' => $name, ':email' => $email, ':password' => password_hash($password, PASSWORD_DEFAULT)]);

respond(['success' => true, 'message' => 'ចុះឈ្មោះបានជោគជ័យ', 'id' => $db->lastInsertId()], 201);
