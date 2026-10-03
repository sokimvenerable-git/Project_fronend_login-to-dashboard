<?php
require_once __DIR__ . '/../../config/auth.php';

$auth = require_auth();
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') fail('Method not allowed.', 405);

$d = json_input();
$name = trim($d['name'] ?? '');
$email = strtolower(trim($d['email'] ?? ''));
if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) fail('សូមបញ្ចូលឈ្មោះ និងអ៊ីមែលឲ្យត្រឹមត្រូវ');

$db = db();
$c = $db->prepare('SELECT id FROM users WHERE email = :e AND id <> :id');
$c->execute([':e' => $email, ':id' => $auth['id']]);
if ($c->fetch()) fail('អ៊ីមែលនេះមានគេប្រើរួចហើយ', 409);

$db->prepare('UPDATE users SET name = :n, email = :e WHERE id = :id')->execute([':n' => $name, ':e' => $email, ':id' => $auth['id']]);
$u = $db->prepare('SELECT id, name, email, role FROM users WHERE id = :id');
$u->execute([':id' => $auth['id']]);
respond(['success' => true, 'user' => $u->fetch()]);
