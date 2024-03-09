document.addEventListener('DOMContentLoaded', () => {
    // Add event listener to the add button
    document.querySelector('.add-button').addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent default button behavior
        
        // Get the values from the input fields
        const name = encodeURIComponent(document.getElementById('name').value.trim());
        const district = encodeURIComponent(document.getElementById('district').value.trim());
        const url = encodeURIComponent(document.getElementById('url').value.trim());
        let rating = parseFloat(document.getElementById('rating').value.trim());
        const mapsURL = encodeURIComponent(document.getElementById('mapsURL').value.trim());

        // Check if rating is NaN and set it to null
        if (isNaN(rating)) {
            rating = null;
        }

        // Check if name is null or empty
        if (!name || !district) {
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
                document.getElementById('name').value = '';
                document.getElementById('district').value = '';
                document.getElementById('url').value = '';
                document.getElementById('rating').value = '';
                document.getElementById('mapsURL').value = '';
            } else {
                alert('Add failed');
                console.error(data.message);
            }
        }
        
    });
});