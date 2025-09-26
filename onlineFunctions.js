export async function sayHelloOnline(message) {
    alert('Hello from onlineJS (JS module, fetching PHP data): ' + message);
    try {
        const response = await fetch('./onlineJS.php?message=' + encodeURIComponent(message));
        if (response.ok) {
            const data = await response.text(); // Assuming onlineJS.php will return plain text
            console.log('PHP endpoint response:', data);
        } else {
            console.error('PHP endpoint error:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching PHP endpoint:', error);
    }
}
