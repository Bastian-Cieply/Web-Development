document.addEventListener('DOMContentLoaded', () => {
    // Add event listener to the add button
    document.querySelector('.add-button').addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent default button behavior
        
        // Get the values from the input fields
        const name = document.getElementById('name').value || null;
        const district = document.getElementById('district').value || null;
        const url = document.getElementById('url').value || null;
        const rating = parseFloat(document.getElementById('rating').value) || null;
        const mapsURL = document.getElementById('mapsURL').value || null;

        // Check if name is null or empty
        if (!name || !district ) {
            document.getElementById('name').placeholder = 'Name is required';
            document.getElementById('district').placeholder = 'District is required';
            return;
        } else {
            const response = await fetch(`/api/add-store?name=${name}&url=${url}&district=${district}&rating=${rating}&mapsurl=${mapsURL}`);
            const data = await response.json();

            // Act on the response message
            if (data.message === 'Added successful') {
                alert('Added successfully');
                // Clear input fields
            } else {
                alert('Add failed');
                console.error(data.message);
            }
        }
        
    });
});
