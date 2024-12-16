document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the form from submitting normally

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log('Email:', email); // Debugging
  console.log('Password:', password); // Debugging

  try {
      // Send POST request to server with email and password
      const response = await fetch('/auth/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
          const data = await response.json();

          console.log('Login Successful:', data); // Log response for debugging

          if (data.token) {
              // Store the token in localStorage
              localStorage.setItem('token', data.token);
              console.log('Token saved to localStorage:', data.token); // Debugging

              // Redirect to the dashboard after successful login
              window.location.href = 'dashboard.html';
          } else {
              alert('Login failed: No token received');
          }
      } else {
          const errorData = await response.json();
          alert('Login failed: ' + errorData.message); // Show error message from backend
      }
  } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again later.');
  }
});