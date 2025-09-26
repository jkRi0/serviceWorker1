<?php

header("Content-Type: text/plain"); // Set content type for plain text

if (isset($_GET['message'])) {
    echo 'PHP endpoint received: ' . htmlspecialchars($_GET['message']);
} else {
    echo 'PHP endpoint: No message received.';
}

?>
