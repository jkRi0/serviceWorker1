console.log('App is running!');

// Function to update connection status
function updateConnectionStatus(isOnline) {
  const statusElement = document.getElementById('connection-status');
  
  if (statusElement) {
    statusElement.textContent = `You are currently ${isOnline ? 'online' : 'offline'}`;
    statusElement.className = isOnline ? 'online' : 'offline';
  }
}

// Function to check internet connection
function checkInternetConnection() {
  // Try to fetch a small file or make a HEAD request to a reliable server
  fetch('https://www.google.com/favicon.ico', { 
    mode: 'no-cors',
    cache: 'no-cache'
  })
    .then(() => {
      updateConnectionStatus(true);
    })
    .catch(() => {
      updateConnectionStatus(false);
    });
}

// Create a real-time connection monitor
function createConnectionMonitor() {
  // Initial check
  checkInternetConnection();
  
  // Check every 5 seconds
  setInterval(checkInternetConnection, 5000);
  
  // Also keep the event listeners for immediate feedback
  window.addEventListener('online', () => {
    updateConnectionStatus(true);
  });

  window.addEventListener('offline', () => {
    updateConnectionStatus(false);
  });
}

// Start monitoring
createConnectionMonitor();




// const isOnline = window.navigator.onLine;

// if (isOnline) {
//   console.log("The browser is online.");
// } else {
//   console.log("The browser is offline.");
// }




// Add unregister service worker functionality
// const unregisterButton = document.getElementById('unregister-sw-button');
// if (unregisterButton) {
//   unregisterButton.addEventListener('click', () => {
//     if ('serviceWorker' in navigator) {
//       navigator.serviceWorker.getRegistrations().then(function(registrations) {
//         for (let registration of registrations) {
//           registration.unregister().then(function(boolean) {
//             console.log((boolean ? 'Successfully unregistered' : 'Failed to unregister') + ' service worker: ' + registration.scope);
//           });
//         }
//       }).catch(function(error) {
//         console.error('Error unregistering service worker:', error);
//       });
//     }
//   });
// }