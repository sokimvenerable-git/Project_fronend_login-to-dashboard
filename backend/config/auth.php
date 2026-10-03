<?php
// Shared helpers: CORS, JSON responses, signed tokens (HMAC-SHA256).
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/database.php';

// IMPORTANT: change this secret before deploying anywhere real.
define('APP_SECRET', getenv('APP_SECRET') ?: 'change-this-secret-key-before-production');
define('TOKEN_TTL', 60 * 60 * 24 * 7); // 7 days

set_exception_handler(function ($e) {
    respond(['error' => 'Server error: ' . $e->getMessage()], 500);
});

function respond($data, $code = 200)
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function fail($message, $code = 400)
{
    respond(['error' => $message], $code);
}

function json_input()
{
    $data = json_decode(file_get_contents('php://input'), true);
    return is_array($data) ? $data : [];
}

function db()
{
    return (new Database())->getConnection();
}

function b64u($s)
{
    return rtrim(strtr(base64_encode($s), '+/', '-_'), '=');
}

function b64u_decode($s)
{
    return base64_decode(strtr($s, '-_', '+/'));
}

function create_token($user)
{
    $payload = b64u(json_encode(['id' => (int) $user['id'], 'role' => $user['role'], 'exp' => time() + TOKEN_TTL]));
    return $payload . '.' . b64u(hash_hmac('sha256', $payload, APP_SECRET, true));
}

function bearer_token()
{
    $h = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (!$h && function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) {
            if (strtolower($k) === 'authorization') {
                $h = $v;
            }
        }
    }
    return preg_match('/Bearer\s+(.+)/i', $h, $m) ? trim($m[1]) : null;
}

// Returns ['id' => .., 'role' => ..]. Stops with 401/403 if invalid.
function require_auth($adminOnly = false)
{
    $token = bearer_token();
    if (!$token || substr_count($token, '.') !== 1) {
        fail('Unauthorized', 401);
    }
    [$payload, $sig] = explode('.', $token);
    $expected = b64u(hash_hmac('sha256', $payload, APP_SECRET, true));
    if (!hash_equals($expected, $sig)) {
        fail('Unauthorized', 401);
    }
    $data = json_decode(b64u_decode($payload), true);
    if (!$data || ($data['exp'] ?? 0) < time()) {
        fail('Unauthorized', 401);
    }
    if ($adminOnly && $data['role'] !== 'admin') {
        fail('សម្រាប់តែអ្នកគ្រប់គ្រងប៉ុណ្ណោះ', 403);
    }
    return $data;
}
