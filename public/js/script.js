document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting normally
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // For now, just log the email and password to the console
    console.log('Email:', email);
    console.log('Password:', password);
  
    // Send POST request to server with email and password
    // Example:
    /*
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await response.json();
    console.log(data);
    */
});
  