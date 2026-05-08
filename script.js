document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const submitBtn = loginForm.querySelector('.submit-btn');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulate a login request
        submitBtn.classList.add('loading');
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Output for demonstration (password won't be visible in UI thanks to type="password")
        console.log(`Login attempt for username: ${username}`);
        
        // Send the data to our new SQLite backend server
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            submitBtn.classList.remove('loading');
            
            if (data.success) {
                // Show a simple success effect
                const originalText = submitBtn.querySelector('span').textContent;
                submitBtn.querySelector('span').textContent = 'Saved to Database!';
                submitBtn.style.background = '#10b981'; // green color
                
                setTimeout(() => {
                    // Reset form and button
                    submitBtn.querySelector('span').textContent = originalText;
                    submitBtn.style.background = '';
                    loginForm.reset();
                }, 2000);
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            submitBtn.classList.remove('loading');
            console.error('Error:', error);
            alert('Failed to connect to the server.');
        });
    });
});
