document.addEventListener('DOMContentLoaded', () => {
    const voterSelect = document.getElementById('voters');
    const assignedVotersList = document.getElementById('assignedVoters');
    const assignVotersButton = document.getElementById('assignVotersButton');

    // Fetch users and populate the "Available Voters" dropdown
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
                if (user.role !== 'student') { // Assuming students can't vote
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

    // Handle "Assign Voters" button click
    assignVotersButton.addEventListener('click', () => {
        const selectedOptions = Array.from(voterSelect.selectedOptions);

        if (selectedOptions.length === 0) {
            alert('Please select at least one voter to assign.');
            return;
        }

        selectedOptions.forEach((option) => {
            // Create a list item for the assigned voter
            const listItem = document.createElement('li');
            listItem.textContent = option.textContent;
            listItem.dataset.userId = option.value; // Store user_id for submission

            // Append to the "Assigned Voters" section
            assignedVotersList.appendChild(listItem);

            // Remove the voter from the dropdown
            option.remove();
        });
    });
});