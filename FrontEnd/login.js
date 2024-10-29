// Fonction principale d'authentification
export async function handleLogin(event) {
    if (!window.location.pathname.includes('login.html')) {
        return;
    }

    // Récupération des valeurs du formulaire
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDisplay = document.getElementById('error-message');

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: email, 
                password: password 
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Stockage des informations de connexion
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            
            // Redirection vers la page d'accueil
            window.location.href = './index.html';
        } else {
            // Affichage du message d'erreur
            errorDisplay.textContent = "Email ou mot de passe incorrect";
            errorDisplay.style.display = 'block';
            errorDisplay.style.fontSize = '1.5em';
            errorDisplay.style.textAlign = 'center';
            errorDisplay.style.marginTop = '30px';
            
            // Réinitialisation du champ mot de passe
            document.getElementById('password').value = '';
        }

    } catch (error) {
        console.error('Erreur:', error);
        errorDisplay.textContent = "Une erreur est survenue lors de la connexion";
        errorDisplay.style.display = 'block';
        errorDisplay.style.fontSize = '1.5em';
        errorDisplay.style.textAlign = 'center';
        errorDisplay.style.marginTop = '30px';
    }
}

// Initialisation du gestionnaire d'événements
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('login.html')) {
        // Vérification si l'utilisateur est déjà connecté
        const token = localStorage.getItem('token');
        if (token) {
            // Redirection vers la page d'accueil si déjà connecté
            window.location.href = './index.html';
            return;
        }

        const loginForm = document.querySelector('#login form');
        if (loginForm) {
            loginForm.addEventListener('submit', (event) => {
                event.preventDefault();
                handleLogin(event);
            });
        }
    }
});

export function updateLoginLogoutButton() {
    const loginLogoutLink = document.getElementById("loginLogout");
    const token = localStorage.getItem("token");

    if (token) {
        loginLogoutLink.textContent = "logout";
        loginLogoutLink.href = "#";
        loginLogoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            window.location.reload();
        });
    }
}