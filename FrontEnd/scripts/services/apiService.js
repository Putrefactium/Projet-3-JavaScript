/**
 * Gestion des requêtes à l'API
 * @module apiService
 */

import { checkTokenValidity } from '../features/auth/login.js';

/**
 * Charge les works depuis le sessionStorage ou à l'aide d'un Fetch depuis l'API si non présents en cache
 * - Vérifie d'abord la présence des données dans le sessionStorage
 * - Si absent, effectue une requête à l'API pour récupérer les works
 * - Stocke les données récupérées dans le sessionStorage
 * @returns {Promise<Array>} Tableau des works chargés
 */
export async function loadWorks() {
    const storedWorks = JSON.parse(window.sessionStorage.getItem("works")); // Vérifie la présence des données dans le sessionStorage

    return storedWorks || await (async () => {  // Si storedWorks est vide
        const answer = await fetch("http://localhost:5678/api/works"); // Effectue une requête Fetch à l'API pour récupérer les works
        const works = await answer.json(); // Convertit la réponse en JSON
        window.sessionStorage.setItem("works", JSON.stringify(works)); // Stocke les données dans le sessionStorage
        return works; // Retourne les données récupérées 
    })();
}

/**
 * Envoie une requête de connexion via un Fetch POST à l'API
 * - Effectue une requête POST vers l'endpoint de connexion
 * - Envoie les identifiants au format JSON
 * - Retourne la réponse de l'API
 * @param {string} email - L'email de l'utilisateur
 * @param {string} password - Le mot de passe de l'utilisateur
 * @returns {Promise<Object>} La réponse de l'API contenant le token
 */
export async function loginToApi (email, password) {
    const response = await fetch('http://localhost:5678/api/users/login', {
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
 * - Vérifie la validité du token
 * - Effectue une requête DELETE pour supprimer le work
 * @param {number} workId - L'identifiant du work à supprimer
 */
export async function deleteWork(workId) {
    if (!checkTokenValidity()) return; // Vérifie la validité du token pour avoir le droit de supprimer un work

    const token = sessionStorage.getItem('token'); // Récupère le token dans le sessionStorage
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, { // Effectue une requête DELETE pour supprimer le work
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
 * Met à jour le sessionStorage avec les nouvelles données
 * @returns {Promise<Array>} Tableau mis à jour des projets
 */
export async function refreshWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    window.sessionStorage.setItem("works", JSON.stringify(works));
    return works;
}

/**
 * Charge la liste des catégories depuis l'API
 * - Effectue une requête GET pour récupérer toutes les catégories
 * @returns {Promise<Array>} Tableau des catégories
 */
export async function fetchCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
}

/**
 * Envoie les données du formulaire à l'API pour ajouter un nouveau work
 * - Effectue une requête POST pour ajouter un work
 * @param {FormData} formData - Les données du formulaire à envoyer
 * @returns {Promise<Object>} La réponse de l'API
 */
export async function postFormData(formData) {
    const response = await fetch("http://localhost:5678/api/works", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}` // Ajoute le token dans les headers
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi');
    }

    return await response;
}
