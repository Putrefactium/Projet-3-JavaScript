/**
 * Gestion de l'affichage dynamique des éléments de l'interface
 * Ce module gère l'affichage conditionnel des éléments de l'interface
 * en fonction de l'état de connexion de l'utilisateur (mode édition,
 * bouton de connexion/déconnexion)
 * @module display
 */

import { openModal } from '../modal/modal.js';

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
    const token = sessionStorage.getItem('token'); // Récupère le token dans le sessionStorage
    
    token && (() => { // Si le token existe : 
        const editionModeHTML = ` 
            <div class="edition-mode">
                <a href="#" class="edition-link">
                    <img src="./assets/icons/edit.png" alt="Mode édition">
                    <p>Mode édition</p>
                </a>
            </div>
        `;
        
        const header = document.querySelector('header'); // Sélectionne le header de la page
        header?.parentNode.insertBefore( // Insère la barre d'édition avant le header
            document.createRange().createContextualFragment(editionModeHTML), 
            header
        );

        // Ajouter l'écouteur d'événements après l'insertion
        document.querySelector('.edition-link').addEventListener('click', (e) => {
            e.preventDefault();
            openModal(e);
        });
    })();
};

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
    const loginLogoutLink = document.getElementById("login-logout"); // Sélectionne le lien de connexion/déconnexion dans le DOM
    const token = sessionStorage.getItem("token"); // Récupère le token dans le sessionStorage

    token && (() => { // Si le token existe :
        loginLogoutLink.textContent = "logout"; // Change le texte du lien en "logout"
        loginLogoutLink.href = "#"; // Change l'URL du lien en "#"
        loginLogoutLink.addEventListener("click", e => { // Ajoute un écouteur d'événement sur le lien
            e.preventDefault(); // Empêche le comportement par défaut du lien
            sessionStorage.removeItem("token"); // Supprime le token dans le sessionStorage
            sessionStorage.removeItem("userId"); // Supprime l'ID utilisateur dans le sessionStorage
            window.location.reload(); // Recharge la page
        });
    })();
};

/**
 * Affiche le bouton de modification
 * - Vérifie si un token d'authentification existe
 * - Si un token existe:
 *   - Crée un bouton de modification
 *   - Ajoute un lien cliquable qui ouvre une modal
 */
export const displayEditButton = () => {
    const token = sessionStorage.getItem('token'); // Récupère le token dans le sessionStorage
    
    token && (() => { // Si le token existe :
        const buttonHTML = `
            <button class="edit-button">
                <a href="#" onclick="event.preventDefault(); openModal(event);">
                    <img src="./assets/icons/edit-black.png" alt="Modifier">
                    <span>Modifier</span>
                </a>
            </button>
        `;
        
        const galleryHeader = document.querySelector('.gallery-header'); // Sélectionne la section de la galerie dans le DOM
        const titleH2 = galleryHeader.querySelector('h2'); // Sélectionne le titre h2 de la galerie
        
        titleH2.insertAdjacentHTML('afterend', buttonHTML); // Insère le bouton de modification après le titre h2

        // Ajouter l'écouteur d'événements après l'insertion
        document.querySelector('.edit-button').addEventListener('click', (e) => {
            e.preventDefault();
            openModal(e);
        });
    })();
};

