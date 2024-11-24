/**
 * Gestion des requêtes à l'API
 * @module apiService
 */

import { checkTokenValidity } from '../features/auth/login.js';
import API_CONFIG from './config.js';
import { showDeleteConfirmation, showNotification } from '../utils/uiComponents.js';

/**
 * Charge les works depuis le sessionStorage ou à l'aide d'un Fetch depuis l'API si non présents en cache
 * @returns {Promise<Array>} Tableau des works chargés
 * @throws {Error} Si le chargement des works échoue
 */
export async function loadWorks() {
    try {
        const storedWorks = JSON.parse(window.sessionStorage.getItem("works"));

        if (storedWorks) {
            return storedWorks;
        }

        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORKS}`);
        
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des projets');
        }

        const works = await response.json();
        window.sessionStorage.setItem("works", JSON.stringify(works));
        return works;

    } catch (error) {
        console.error('Erreur lors du chargement des works:', error);
        showNotification('Erreur lors du chargement des projets', 'error');
        return []; // Retourne un tableau vide en cas d'erreur
    }
}

/**
 * Envoie une requête de connexion via un Fetch POST à l'API
 * @param {string} email - L'email de l'utilisateur
 * @param {string} password - Le mot de passe de l'utilisateur
 * @returns {Promise<Object>} La réponse de l'API contenant le token
 */
export async function loginToApi(email, password) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            throw new Error('Identifiants incorrects');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showNotification('Erreur lors de la connexion', 'error');
        throw error; // Propager l'erreur pour la gestion dans le composant
    }
}

/**
 * Supprime un work via un Fetch DELETE à l'API
 * @param {number} workId - L'identifiant du work à supprimer
 */
export async function deleteWork(workId) {
    if (!checkTokenValidity()) {
        showNotification("Votre session a expiré. Veuillez vous reconnecter.", 'error');
        window.location.href = "login.html";
        return false;
    }

    const confirmed = await showDeleteConfirmation(workId);
    if (!confirmed) return false;

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORKS}/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression');
        }

        showNotification('La photo a été supprimé avec succès', 'success');
        return true;
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Une erreur est survenue lors de la suppression de la photo', 'error');
        return false;
    }
}

/**
 * Rafraîchit la liste des projets depuis l'API
 * @returns {Promise<Array>} Tableau des works mis à jour
 */
export async function refreshWorks() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORKS}`);
        if (!response.ok) {
            throw new Error('Erreur lors du rafraîchissement des projets');
        }
        const works = await response.json();
        window.sessionStorage.setItem("works", JSON.stringify(works));
        return works;
    } catch (error) {
        console.error('Erreur lors du rafraîchissement des works:', error);
        showNotification('Erreur lors du rafraîchissement des projets', 'error');
        return [];
    }
}

/**
 * Charge la liste des catégories depuis l'API
 * @returns {Promise<Array>} Tableau des catégories
 */
export async function fetchCategories() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATEGORIES}`);
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des catégories');
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        showNotification('Erreur lors du chargement des catégories', 'error');
        return []; // Retourne un tableau vide en cas d'erreur
    }
}



/**
 * Envoie les données du formulaire à l'API pour ajouter un nouveau work
 * @param {FormData} formData - Les données du formulaire à envoyer
 * @returns {Promise<Object>} La réponse de l'API
 */
export async function postFormData(formData) {
    try {
        if (!checkTokenValidity()) {
            showNotification("Votre session a expiré. Veuillez vous reconnecter.", 'error');
            throw new Error('Session expirée');
        }

        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORKS}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de l\'ajout du projet');
        }
        
        showNotification('Photo ajoutée avec succès', 'success');
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de l\'ajout du projet:', error);
        showNotification(error.message, 'error');
        return null;
    }
}