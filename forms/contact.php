<?php
/**
 * Contact form handler for Mayi Pty Ltd
 * Requires the "PHP Email Form" library (pro version of BootstrapMade template).
 * Library path: assets/vendor/php-email-form/php-email-form.php
 */

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Method Not Allowed');
}

// Load the mailer library
if (file_exists($php_email_form = '../assets/vendor/php-email-form/php-email-form.php')) {
    include($php_email_form);
} else {
    http_response_code(500);
    die('Unable to load the "PHP Email Form" library.');
}

// Sanitize inputs
$name    = filter_input(INPUT_POST, 'name',    FILTER_SANITIZE_SPECIAL_CHARS);
$email   = filter_input(INPUT_POST, 'email',   FILTER_SANITIZE_EMAIL);
$subject = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_SPECIAL_CHARS);
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_SPECIAL_CHARS);

// Validate required fields
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    http_response_code(400);
    die('All fields are required.');
}

// Validate email address format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    die('Invalid email address.');
}

// Enforce maximum lengths (mirrors HTML maxlength attributes)
if (mb_strlen($name) > 100 || mb_strlen($subject) > 200 || mb_strlen($message) > 5000) {
    http_response_code(400);
    die('One or more fields exceed the maximum allowed length.');
}

$receiving_email_address = 'mayiptyltd@gmail.com';

$contact = new PHP_Email_Form;
$contact->ajax = true;
$contact->to         = $receiving_email_address;
$contact->from_name  = $name;
$contact->from_email = $email;
$contact->subject    = '[mayi.com.au] ' . $subject;

$contact->add_message($name,    'From');
$contact->add_message($email,   'Email');
$contact->add_message($message, 'Message', 10);

echo $contact->send();
