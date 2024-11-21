/**
 * Gestion des requêtes à l'API
 * @module apiService
 */

import { checkTokenValidity } from '../features/auth/login.js';
import API_CONFIG from './config.js';

/**
 * Charge les works depuis le sessionStorage ou à l'aide d'un Fetch depuis l'API si non présents en cache
 * @returns {Promise<Array>} Tableau des works chargés
 */
export async function loadWorks() {
    const storedWorks = JSON.parse(window.sessionStorage.getItem("works"));

    return storedWorks || await (async () => {
        const answer = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORKS}`);
        const works = await answer.json();
        window.sessionStorage.setItem("works", JSON.stringify(works));
        return works;
    })();
}

/**
 * Envoie une requête de connexion via un Fetch POST à l'API
 * @param {string} email - L'email de l'utilisateur
 * @param {string} password - Le mot de passe de l'utilisateur
 * @returns {Promise<Object>} La réponse de l'API contenant le token
 */
export async function loginToApi(email, password) {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    return await response.json();
}

/**
 * Supprime un work via un Fetch DELETE à l'API
 * @param {number} workId - L'identifiant du work à supprimer
 */
export async function deleteWork(workId) {
    if (!checkTokenValidity()) return;

    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORKS}/${workId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la suppression du projet');
    }

    return response;
}

/**
 * Rafraîchit la liste des projets depuis l'API
 * @returns {Promise<Array>} Tableau des works mis à jour
 */
export async function refreshWorks() {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORKS}`);
    const works = await response.json();
    window.sessionStorage.setItem("works", JSON.stringify(works));
    return works;
}

/**
 * Charge la liste des catégories depuis l'API
 * @returns {Promise<Array>} Tableau des catégories
 */
export async function fetchCategories() {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATEGORIES}`);
    return await response.json();
}

/**
 * Envoie les données du formulaire à l'API pour ajouter un nouveau work
 * @param {FormData} formData - Les données du formulaire à envoyer
 * @returns {Promise<Object>} La réponse de l'API
 */
export async function postFormData(formData) {
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
    
    return await response.json();
}