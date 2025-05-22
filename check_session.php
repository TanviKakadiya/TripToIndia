<?php
session_start();

// Check if user is logged in
$logged_in = isset($_SESSION['user_id']);
$response = array('logged_in' => $logged_in);

if ($logged_in) {
    $response['email'] = $_SESSION['email'];
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>