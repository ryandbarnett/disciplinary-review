document.addEventListener('DOMContentLoaded', () => {
    const voterSelect = document.getElementById('voters');
    const assignedVotersList = document.getElementById('assignedVoters');
    const assignedVotersInputs = document.getElementById('assignedVotersInputs');
    const assignVotersButton = document.getElementById('assignVotersButton');
    const unassignVotersButton = document.getElementById('unassignVotersButton');

    // Fetch users and populate the "Available Voters" dropdown
    fetch('/api/users')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json();
        })
        .then((users) => {
            voterSelect.innerHTML = '';
            users.forEach((user) => {
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

    // Assign voters
    assignVotersButton.addEventListener('click', () => {
        const selectedOptions = Array.from(voterSelect.selectedOptions);

        if (selectedOptions.length === 0) {
            alert('Please select at least one voter to assign.');
            return;
        }

        selectedOptions.forEach((option) => {
            const listItem = document.createElement('li');
            listItem.textContent = option.textContent;
            listItem.dataset.userId = option.value;

            listItem.addEventListener('click', () => {
                listItem.classList.toggle('selected');
            });

            assignedVotersList.appendChild(listItem);

            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'assignedVoters[]';
            hiddenInput.value = option.value;
            assignedVotersInputs.appendChild(hiddenInput);

            option.remove();
        });
    });

    // Unassign voters
    unassignVotersButton.addEventListener('click', () => {
        const selectedItems = Array.from(assignedVotersList.querySelectorAll('.selected'));

        if (selectedItems.length === 0) {
            alert('Please select at least one voter to unassign.');
            return;
        }

        selectedItems.forEach((item) => {
            const userId = item.dataset.userId;

            // Add the voter back to the dropdown
            const option = document.createElement('option');
            option.value = userId;
            option.textContent = item.textContent;
            voterSelect.appendChild(option);

            // Remove the hidden input
            const hiddenInput = assignedVotersInputs.querySelector(`input[value="${userId}"]`);
            if (hiddenInput) hiddenInput.remove();

            // Remove the voter from the "Assigned Voters" section
            item.remove();
        });
    });
});