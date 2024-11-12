/**
 * Gestion de l'affichage dynamique des éléments de l'interface
 * Ce module gère l'affichage conditionnel des éléments de l'interface
 * en fonction de l'état de connexion de l'utilisateur (mode édition,
 * bouton de connexion/déconnexion)
 * @module display
 */

import { openModal } from '../../components/modal.js';

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
    const token = sessionStorage.getItem('token');
    
    token && (() => {
        const editionModeHTML = `
            <div class="edition-mode">
                <a href="#" class="edition-link">
                    <img src="./assets/icons/edit.png" alt="Mode édition">
                    <p>Mode édition</p>
                </a>
            </div>
        `;
        
        const header = document.querySelector('header');
        header?.parentNode.insertBefore(
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
    const loginLogoutLink = document.getElementById("login-logout");
    const token = sessionStorage.getItem("token");

    token && (() => {
        loginLogoutLink.textContent = "logout";
        loginLogoutLink.href = "#";
        loginLogoutLink.addEventListener("click", e => {
            e.preventDefault();
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("userId");
            window.location.reload();
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
    const token = sessionStorage.getItem('token');
    
    token && (() => {
        const buttonHTML = `
            <button class="edit-button">
                <a href="#" onclick="event.preventDefault(); openModal(event);">
                    <img src="./assets/icons/edit-black.png" alt="Modifier">
                    <span>Modifier</span>
                </a>
            </button>
        `;
        
        const galleryHeader = document.querySelector('.gallery-header');
        const titleH2 = galleryHeader.querySelector('h2');
        
        titleH2.insertAdjacentHTML('afterend', buttonHTML);

        // Ajouter l'écouteur d'événements après l'insertion
        document.querySelector('.edit-button').addEventListener('click', (e) => {
            e.preventDefault();
            openModal(e);
        });
    })();
};

