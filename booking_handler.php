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

// Handle flight booking
if (isset($_POST['book_flight'])) {
    $from_location = sanitize_input($_POST['from']);
    $to_location = sanitize_input($_POST['to']);
    $departure_date = sanitize_input($_POST['departure']);
    $return_date = isset($_POST['return']) ? sanitize_input($_POST['return']) : null;
    $adults = sanitize_input($_POST['adults']);
    $children = sanitize_input($_POST['children']);
    $infants = sanitize_input($_POST['infants']);
    
    // Validate input
    if (empty($from_location) || empty($to_location) || empty($departure_date) || empty($adults)) {
        $_SESSION['error'] = "Required fields are missing";
        header("Location: booking.html");
        exit();
    }
    
    // Insert flight booking
    $stmt = $conn->prepare("INSERT INTO flights (from_location, to_location, departure_date, return_date, adults, children, infants) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $from_location, $to_location, $departure_date, $return_date, $adults, $children, $infants);
    
    if ($stmt->execute()) {
        $_SESSION['success'] = "Flight booking successful!";
        header("Location: transport-option-list.html");
        exit();
    } else {
        $_SESSION['error'] = "Booking failed: " . $conn->error;
        header("Location: booking.html");
        exit();
    }
    
    $stmt->close();
}

// Handle train booking
if (isset($_POST['book_train'])) {
    $from_station = sanitize_input($_POST['from-station']);
    $to_station = sanitize_input($_POST['to-station']);
    $journey_date = sanitize_input($_POST['journey-date']);
    $return_date = isset($_POST['return-date']) ? sanitize_input($_POST['return-date']) : null;
    $adults = sanitize_input($_POST['adults']);
    $children = sanitize_input($_POST['children']);
    $infants = sanitize_input($_POST['infants']);
    
    // Validate input
    if (empty($from_station) || empty($to_station) || empty($journey_date) || empty($adults)) {
        $_SESSION['error'] = "Required fields are missing";
        header("Location: booking.html");
        exit();
    }
    
    // Insert train booking
    $stmt = $conn->prepare("INSERT INTO trains (from_station, to_station, journey_date, return_date, adults, children, infants) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $from_station, $to_station, $journey_date, $return_date, $adults, $children, $infants);
    
    if ($stmt->execute()) {
        $_SESSION['success'] = "Train booking successful!";
        header("Location: transport-option-list.html");
        exit();
    } else {
        $_SESSION['error'] = "Booking failed: " . $conn->error;
        header("Location: booking.html");
        exit();
    }
    
    $stmt->close();
}

// Handle car booking
if (isset($_POST['book_car'])) {
    $pickup_location = sanitize_input($_POST['pickup-location']);
    $dropoff_location = sanitize_input($_POST['dropoff-location']);
    $pickup_date = sanitize_input($_POST['pickup-date']);
    $dropoff_date = sanitize_input($_POST['dropoff-date']);
    $pickup_time = sanitize_input($_POST['pickup-time']);
    $dropoff_time = sanitize_input($_POST['dropoff-time']);
    
    // Validate input
    if (empty($pickup_location) || empty($dropoff_location) || empty($pickup_date) || empty($dropoff_date)) {
        $_SESSION['error'] = "Required fields are missing";
        header("Location: booking.html");
        exit();
    }
    
    // Insert car booking
    $stmt = $conn->prepare("INSERT INTO cars (pickup_location, dropoff_location, pickup_date, dropoff_date, pickup_time, dropoff_time) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $pickup_location, $dropoff_location, $pickup_date, $dropoff_date, $pickup_time, $dropoff_time);
    
    if ($stmt->execute()) {
        $_SESSION['success'] = "Car booking successful!";
        header("Location: transport-option-list.html");
        exit();
    } else {
        $_SESSION['error'] = "Booking failed: " . $conn->error;
        header("Location: booking.html");
        exit();
    }
    
    $stmt->close();
}

$conn->close();
?>