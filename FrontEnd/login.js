/**
 * Gestion de l'authentification et des fonctionnalités liées à la connexion
 * Ce module gère le processus de connexion, la déconnexion, et l'affichage
 * des éléments d'interface conditionnels à l'état de connexion de l'utilisateur
 * @module login
 */

/**
 * Import des dépendances nécessaires
 */
import { openModal } from './modale.js';

// Fonction principale d'authentification
export async function handleLogin(event) {
    // Vérifie si nous sommes sur la page de connexion
    if (!window.location.pathname.includes('login.html')) {
        return;
    }

    // Récupère les valeurs des champs du formulaire
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDisplay = document.getElementById('error-message');

    try {
        // Envoi de la requête de connexion à l'API
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

         // Si la connexion réussit
         if (response.ok) {
            // Stockage du token et de l'ID utilisateur dans le localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);

            // Redirection vers la page d'accueil
            window.location.href = './index.html';
        } else {
            // Affichage du message d'erreur
            errorDisplay.textContent = "Email ou mot de passe incorrect";
            // Configuration du style du message d'erreur
            errorDisplay.style.display = 'block';
            errorDisplay.style.fontSize = '1.5em';
            errorDisplay.style.textAlign = 'center';
            errorDisplay.style.marginTop = '30px';
            
            // Réinitialisation du champ mot de passe
            document.getElementById('password').value = '';
        }

    } catch (error) {
        // Gestion des erreurs techniques
        console.error('Erreur:', error);
        errorDisplay.textContent = "Une erreur est survenue lors de la connexion";
        // Configuration du style du message d'erreur
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

export const updateLoginLogoutButton = () => {
    const loginLogoutLink = document.getElementById("login-logout");
    const token = localStorage.getItem("token");

    token && (() => {
        loginLogoutLink.textContent = "logout";
        loginLogoutLink.href = "#";
        loginLogoutLink.addEventListener("click", e => {
            e.preventDefault();
            localStorage.removeItem("token");
            window.location.reload();
        });
    })();
};

export const displayEditionMode = () => {
    const token = localStorage.getItem('token');
    
    token && (() => {
        const createEditionMode = () => {
            const editionMode = document.createElement('div');
            editionMode.className = 'edition-mode';
            
            const link = document.createElement('a');
            link.href = '#';
            link.onclick = e => {
                e.preventDefault();
                openModal(e);
            };
            
            const img = document.createElement('img');
            img.src = './assets/icons/edit.png';
            img.alt = 'Mode édition';
            
            const text = document.createElement('p');
            text.textContent = 'Mode édition';
            
            return { editionMode, link, img, text };
        };

        const { editionMode, link, img, text } = createEditionMode();
        
        link.append(img, text);
        editionMode.appendChild(link);
        
        const header = document.querySelector('header');
        header?.parentNode.insertBefore(editionMode, header);
    })();
};




