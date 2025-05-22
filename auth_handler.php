<?php
session_start();
include 'db_connect.php';

// Function to sanitize user input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Handle login
if (isset($_POST['login'])) {
    $email = sanitize_input($_POST['email']);
    $password = sanitize_input($_POST['password']);
    
    // Validate input
    if (empty($email) || empty($password)) {
        $_SESSION['error'] = "Email and password are required";
        header("Location: login.html");
        exit();
    }
    
    // Check if user exists
    $stmt = $conn->prepare("SELECT id, email, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        // Verify password
        if (password_verify($password, $user['password'])) {
            // Password is correct, start a new session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['email'] = $user['email'];
            
            // Redirect to index page
            header("Location: index.html");
            exit();
        } else {
            $_SESSION['error'] = "Invalid email or password";
            header("Location: login.html");
            exit();
        }
    } else {
        $_SESSION['error'] = "Invalid email or password";
        header("Location: login.html");
        exit();
    }
    
    $stmt->close();
}

// Handle registration
if (isset($_POST['register'])) {
    $name = sanitize_input($_POST['name']);
    $email = sanitize_input($_POST['email']);
    $phone = sanitize_input($_POST['phone']);
    $password = sanitize_input($_POST['password']);
    $confirm_password = sanitize_input($_POST['confirm_password']);
    
    // Validate input
    if (empty($name) || empty($email) || empty($phone) || empty($password) || empty($confirm_password)) {
        $_SESSION['error'] = "All fields are required";
        header("Location: login.html");
        exit();
    }
    
    // Check if passwords match
    if ($password !== $confirm_password) {
        $_SESSION['error'] = "Passwords do not match";
        header("Location: login.html");
        exit();
    }
    
    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $_SESSION['error'] = "Email already exists";
        header("Location: login.html");
        exit();
    }
    
    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert new user
    $stmt = $conn->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $email, $hashed_password);
    
    if ($stmt->execute()) {
        $_SESSION['success'] = "Registration successful! Please login.";
        header("Location: login.html");
        exit();
    } else {
        $_SESSION['error'] = "Registration failed: " . $conn->error;
        header("Location: login.html");
        exit();
    }
    
    $stmt->close();
}

$conn->close();
?>