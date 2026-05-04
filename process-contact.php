<?php
/**
 * process-contact.php — Dhara Sales & Service
 * Works with OR without a MySQL database.
 * Fallback: saves messages to contacts.json file.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// ── Read input (JSON body or POST form) ──────────────────────
$input = json_decode(file_get_contents('php://input'), true);
if (empty($input)) $input = $_POST;

// ── Sanitize ─────────────────────────────────────────────────
function clean($val) {
    return htmlspecialchars(strip_tags(trim($val ?? '')));
}

$name    = clean($input['name']    ?? '');
$phone   = clean($input['phone']   ?? '');
$email   = clean($input['email']   ?? '');
$subject = clean($input['subject'] ?? 'General Inquiry');
$message = clean($input['message'] ?? '');

// ── Validate ─────────────────────────────────────────────────
$errors = [];

if (strlen($name) < 2)
    $errors[] = 'Name must be at least 2 characters.';

if (!empty($phone) && !preg_match('/^[0-9]{10}$/', preg_replace('/[\s\-\+]/', '', $phone)))
    $errors[] = 'Enter a valid 10-digit phone number.';

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL))
    $errors[] = 'Enter a valid email address.';

if (strlen($message) < 5)
    $errors[] = 'Message must be at least 5 characters.';

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(' ', $errors), 'errors' => $errors]);
    exit;
}

// ── Priority ─────────────────────────────────────────────────
$priority = 'medium';
$sl = strtolower($subject);
if (strpos($sl, 'urgent') !== false || strpos($sl, 'emergency') !== false || strpos($sl, 'complaint') !== false)
    $priority = 'high';
elseif (strpos($sl, 'inquiry') !== false || strpos($sl, 'question') !== false || strpos($sl, 'info') !== false)
    $priority = 'low';

$timestamp  = date('Y-m-d H:i:s');
$message_id = 'MSG' . time();

// ── Try Database (optional) ───────────────────────────────────
$db_success = false;

$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'dhara_service';

try {
    $conn = @new mysqli($db_host, $db_user, $db_pass, $db_name);
    if (!$conn->connect_error) {
        $conn->set_charset('utf8');

        // Create table if not exists
        $conn->query("CREATE TABLE IF NOT EXISTS contact_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            phone VARCHAR(20),
            email VARCHAR(150) NOT NULL,
            subject VARCHAR(200),
            message TEXT NOT NULL,
            priority ENUM('low','medium','high') DEFAULT 'medium',
            status VARCHAR(20) DEFAULT 'new',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )");

        $stmt = $conn->prepare(
            "INSERT INTO contact_messages (name, phone, email, subject, message, priority, status, created_at)
             VALUES (?, ?, ?, ?, ?, ?, 'new', NOW())"
        );
        if ($stmt) {
            $stmt->bind_param('ssssss', $name, $phone, $email, $subject, $message, $priority);
            if ($stmt->execute()) {
                $message_id = 'MSG' . $conn->insert_id;
                $db_success = true;
            }
            $stmt->close();
        }
        $conn->close();
    }
} catch (Exception $e) {
    // DB not available — use file fallback
}

// ── File Fallback (always runs as backup) ────────────────────
$log_file = __DIR__ . '/contacts.json';
$entry = [
    'id'        => $message_id,
    'name'      => $name,
    'phone'     => $phone,
    'email'     => $email,
    'subject'   => $subject,
    'message'   => $message,
    'priority'  => $priority,
    'status'    => 'new',
    'timestamp' => $timestamp,
    'saved_by'  => $db_success ? 'database' : 'file'
];

$existing = [];
if (file_exists($log_file)) {
    $raw = file_get_contents($log_file);
    $existing = json_decode($raw, true) ?: [];
}
$existing[] = $entry;
file_put_contents($log_file, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// ── Send admin email notification (best effort) ──────────────
$admin_email = 'info@dharasales.com';
$email_subject = "New Contact: {$subject} [{$priority} priority]";
$email_body = "New contact message received.\n\n"
    . "Name: {$name}\n"
    . "Phone: {$phone}\n"
    . "Email: {$email}\n"
    . "Subject: {$subject}\n"
    . "Priority: {$priority}\n"
    . "Message:\n{$message}\n\n"
    . "Time: {$timestamp}\n"
    . "Reference: {$message_id}";

$headers = "From: noreply@dharasells.com\r\nReply-To: {$email}\r\nX-Mailer: PHP/" . phpversion();
@mail($admin_email, $email_subject, $email_body, $headers);

// ── Send customer confirmation email (best effort) ───────────
$confirm_subject = "We received your message — Dhara Sales & Service";
$confirm_body = "Dear {$name},\n\n"
    . "Thank you for contacting Dhara Sales & Service!\n\n"
    . "We have received your message and will respond within 24 hours.\n\n"
    . "Your Reference ID: {$message_id}\n"
    . "Subject: {$subject}\n\n"
    . "For urgent matters, call us: +91 98986 70727\n"
    . "WhatsApp: https://wa.me/919898670727\n\n"
    . "Best regards,\nDhara Sales & Service Team\nGujarath, India";

$confirm_headers = "From: info@dharasells.com\r\nReply-To: info@dharasales.com\r\nX-Mailer: PHP/" . phpversion();
@mail($email, $confirm_subject, $confirm_body, $confirm_headers);

// ── Success response ─────────────────────────────────────────
http_response_code(200);
echo json_encode([
    'success'    => true,
    'message'    => 'Thank you ' . $name . '! Your message has been received. We will contact you within 24 hours.',
    'message_id' => $message_id,
    'saved_to'   => $db_success ? 'database' : 'file'
]);
?>
