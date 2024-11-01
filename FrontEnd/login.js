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
    // Return rapide si nous ne sommes pas sur la page de connexion
    if (!window.location.pathname.includes('login.html')) return;

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
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        // Return rapide en cas de succès
        if (response.ok) return (
            localStorage.setItem('token', data.token),
            localStorage.setItem('userId', data.userId),
            window.location.href = './index.html'
        );

        // Configuration du message d'erreur pour login incorrect
        Object.assign(errorDisplay.style, {
            display: 'block',
            fontSize: '1.5em',
            textAlign: 'center',
            marginTop: '30px'
        });
        errorDisplay.textContent = "Email ou mot de passe incorrect";
        return document.getElementById('password').value = '';

    } catch (error) {
        console.error('Erreur:', error);
        // Configuration du message d'erreur technique
        Object.assign(errorDisplay.style, {
            display: 'block',
            fontSize: '1.5em',
            textAlign: 'center',
            marginTop: '30px'
        });
        return errorDisplay.textContent = "Une erreur est survenue lors de la connexion";
    }
}

// Initialisation du gestionnaire d'événements
document.addEventListener('DOMContentLoaded', () => {
    const isLoginPage = window.location.pathname.includes('login.html');
    const token = localStorage.getItem('token');
    
    isLoginPage && token && (window.location.href = './index.html');
    
    isLoginPage && document.querySelector('#login form')?.addEventListener('submit', event => {
        event.preventDefault();
        handleLogin(event);
    });
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





