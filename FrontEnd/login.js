/**
 * Gestion de l'authentification et des fonctionnalités liées à la connexion
 * Ce module gère le processus de connexion, la déconnexion, et l'affichage
 * des éléments d'interface conditionnels à l'état de connexion de l'utilisateur
 * @module login
 */

/**
 * Import des dépendances nécessaires
 */
import { openModal } from './modal.js';


/**
 * Gère le processus de connexion de l'utilisateur
 * - Vérifie si l'utilisateur est sur la page de connexion
 * - Récupère les identifiants saisis (email et mot de passe)
 * - Envoie une requête d'authentification à l'API
 * - En cas de succès : stocke le token et redirige vers la page d'accueil
 * - En cas d'échec : affiche un message d'erreur approprié
 * @param {Event} event - L'événement de soumission du formulaire
 * @returns {void}
 */
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


/**
 * Gestion des événements de la page de connexion
 * - Vérifie si l'utilisateur est sur la page de connexion
 * - Redirige vers la page d'accueil si déjà connecté (token présent)
 * - Ajoute un écouteur d'événement sur le formulaire de connexion
 * - Empêche le comportement par défaut du formulaire
 * - Appelle la fonction handleLogin pour gérer la connexion
 */
document.addEventListener('DOMContentLoaded', () => {
    const isLoginPage = window.location.pathname.includes('login.html');
    const token = localStorage.getItem('token');
    
    isLoginPage && token && (window.location.href = './index.html');
    
    isLoginPage && document.querySelector('#login form')?.addEventListener('submit', event => {
        event.preventDefault();
        handleLogin(event);
    });
});

/**
 * Met à jour le bouton de connexion/déconnexion
 * - Récupère le lien de connexion/déconnexion dans le DOM
 * - Vérifie si un token d'authentification existe
 * - Si un token existe:
 *   - Change le texte du lien en "logout"
 *   - Ajoute un gestionnaire d'événements pour la déconnexion
 *   - Supprime le token et recharge la page lors de la déconnexion
 */
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

/**
 * Gère l'affichage du mode édition pour les utilisateurs connectés
 * - Vérifie si un token d'authentification existe
 * - Si un token existe:
 *   - Crée une barre d'édition en haut de la page
 *   - Contient une icône et un texte "Mode édition"
 *   - Ajoute un lien cliquable qui ouvre une modal
 *   - Insère la barre d'édition avant le header de la page
 */
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





