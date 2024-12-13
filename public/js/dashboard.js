// Fetch users and populate the dashboard
document.addEventListener('DOMContentLoaded', () => {
    const userList = document.getElementById('dashboard-users');

    // Fetch users from the API
    fetch('/api/users')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json();
        })
        .then((users) => {
            // Clear existing list items
            userList.innerHTML = '';

            // Add each user to the list
            users.forEach((user) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${user.email} (${user.role})`;
                userList.appendChild(listItem);
            });
        })
        .catch((error) => {
            console.error(error);
            userList.innerHTML = '<li>Error loading users.</li>';
        });
});