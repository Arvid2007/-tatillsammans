// auth.js

document.addEventListener('DOMContentLoaded', () => {
    checkGlobalLogin();
});

function checkGlobalLogin() {
    const storedUser = localStorage.getItem('user');
    const navUserDiv = document.getElementById("navUser"); // The corner element

    if (storedUser) {
        const user = JSON.parse(storedUser);
        
        // 1. Update the top right corner on ALL pages
        if (navUserDiv) {
            navUserDiv.textContent = user.username;
        }

        // 2. If we happen to be on the Profile Page, update the Profile Card
        const profileCard = document.getElementById("profileCard");
        const authContainer = document.getElementById("authContainer");

        if (profileCard && authContainer) {
            // Hide login form, show profile card
            authContainer.style.display = 'none';
            profileCard.style.display = 'block';

            // Fill in the details
            document.getElementById("profileName").textContent = user.name;
            document.getElementById("profileAge").textContent = user.age;
            document.getElementById("profileUsername").textContent = user.username;
            
            // Set Avatar Initials
            if (user.name) {
                const parts = user.name.trim().split(" ");
                let initials = parts[0][0];
                if (parts.length > 1) initials += parts[parts.length - 1][0];
                const avatar = document.getElementById("profileAvatar");
                if(avatar) avatar.textContent = initials.toUpperCase();
            }
        }
    }
}

// Global Logout Function
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'profile.html'; // Redirect to login screen
}