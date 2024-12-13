document.addEventListener('DOMContentLoaded', () => {
    const voterSelect = document.getElementById('voters');

    // Fetch users from the API
    fetch('/api/users')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json();
        })
        .then((users) => {
            // Clear existing options
            voterSelect.innerHTML = '';

            // Populate the dropdown with eligible voters
            users.forEach((user) => {
                // Assuming students should not be voters
                if (user.role !== 'student') {
                    const option = document.createElement('option');
                    option.value = user.user_id;
                    option.textContent = `${user.email} (${user.role})`;
                    voterSelect.appendChild(option);
                }
            });
        })
        .catch((error) => {
            console.error('Error loading voters:', error);
            voterSelect.innerHTML = '<option disabled>Error loading voters</option>';
        });
});