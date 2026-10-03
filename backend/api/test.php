<?php
require_once __DIR__ . '/../config/auth.php';

db();
respond(['success' => true, 'message' => 'Backend connection is working!', 'timestamp' => date('Y-m-d H:i:s')]);
