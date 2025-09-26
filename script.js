const myButton = document.getElementById('myButton');
if (myButton) {
  myButton.addEventListener('click', async () => {
      const inputValue = document.getElementById('myInput').value;
      const isOnline = await checkInternetConnection();
      
      console.log(isOnline);
      if(isOnline){
          try {
              const { sayHelloOnline } = await import('./onlineFunctions.js'); // Import from JS module
              sayHelloOnline(inputValue);
              console.log("The browser is online.123123");
          } catch (error) {
              console.error("Failed to load onlineFunctions.js online:", error);
          }
      } else {
          try {
              const { sayHello } = await import('./offlineJS.js');
              sayHello(inputValue);
              console.log("The browser is offline.123123");
          } catch (error) {
              console.error("Failed to load offlineJS.js offline:", error);
          }
      }
  });
}


async function checkInternetConnection() {
    try {
        // Fetch a unique URL to bypass service worker cache and browser cache
        await fetch('/online-check.txt?' + new Date().getTime(), { mode: 'no-cors', cache: 'no-store' });
        console.log("The browser is online.");
        return true;
    } catch (error) {
        console.log("The browser is offline.");
        return false;
    }
}

