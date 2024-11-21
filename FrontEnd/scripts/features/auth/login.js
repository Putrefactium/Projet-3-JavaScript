/**
 * Gestion de l'authentification et des fonctionnalités liées à la connexion
 * Ce module gère le processus de connexion, la déconnexion, et l'affichage
 * des éléments d'interface conditionnels à l'état de connexion de l'utilisateur
 * @module login
 */

import { sanitizer } from '../../core/sanitizer.js';
import { loginToApi } from '../../services/apiService.js';

/**
 * Gère le processus de connexion
 * - Récupère les valeurs des champs email et mot de passe
 * - Valide les entrées utilisateur
 * - Tente de se connecter via l'API
 * - Stocke le token et l'ID utilisateur si la connexion réussit
 * - Redirige vers la page d'accueil en cas de succès
 * - Affiche un message d'erreur en cas d'échec
 * @param {Event} event - L'événement de soumission du formulaire
 */
export async function handleLogin(event) {
    const rawEmail = document.getElementById('email').value;
    const rawPassword = document.getElementById('password').value;
    const errorDisplay = document.getElementById('error-message');
    const showError = configureErrorDisplay(errorDisplay);

    const email = sanitizer.sanitizeString(rawEmail);
    const password = sanitizer.sanitizeString(rawPassword);

    if (!validateInputs(email, password, showError)) { // Si les entrées ne sont pas valides, on sort de la fonction
        return;
    }

    try {
        const data = await loginToApi(email, password); // Tente de se connecter à l'API
        if (data.token) { // Si la connexion réussit, on stocke le token et l'ID utilisateur dans le sessionStorage
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('userId', data.userId);
            window.location.href = './index.html'; // Redirige vers la page d'accueil
        }
        else { // Si la connexion échoue, on affiche un message d'erreur
            showError("Identifiant ou mot de passe incorrect");
        }
    } catch (error) { // Si une erreur survient, on affiche un message d'erreur
        console.error('Erreur:', error);
        showError("Une erreur est survenue lors de la connexion");
    }
}

/**
 * Configure l'affichage des messages d'erreur
 * - Prend en paramètre l'élément HTML qui affichera l'erreur
 * - Retourne une fonction qui configure le style et le contenu du message
 * - Définit la taille de police, l'alignement et la marge du message
 * @param {HTMLElement} errorDisplay - L'élément qui affichera l'erreur
 * @returns {Function} Fonction pour afficher les messages d'erreur
 */
const configureErrorDisplay = (errorDisplay) => {
    return (message) => {
        Object.assign(errorDisplay.style, { 
            display: 'block',
            fontSize: '1.5em',
            textAlign: 'center',
            marginTop: '30px'
        });
        errorDisplay.textContent = message;
    };
};

/**
 * Valide les entrées du formulaire de connexion
 * - Vérifie que les champs email et mot de passe ne sont pas vides
 * - Valide le format de l'adresse email, on attendra en entrée un email valide et sanitized
 * - Affiche un message d'erreur si la validation échoue
 * @param {string} email - L'email saisi par l'utilisateur
 * @param {string} password - Le mot de passe saisi par l'utilisateur   
 * @param {Function} showError - Fonction pour afficher les messages d'erreur
 * @returns {boolean} True si les entrées sont valides, false sinon
 */
const validateInputs = (email, password, showError) => {
    if (!email || !password) {
        showError("Veuillez remplir tous les champs");
        return false;
    }

    return true; 
};

/**
 * Gère la routine de connexion
 * - Vérifie si nous sommes sur la page de connexion
 * - Vérifie si un token existe déjà
 * - Si un token existe, redirige vers la page d'accueil
 * - Si nous sommes sur la page de connexion, ajoute un écouteur d'événement sur le formulaire
 * - Empêche le comportement par défaut du formulaire
 * - Appelle la fonction handleLogin lors de la soumission
 */
export const handleLoginRoutine = () => {
    const token = sessionStorage.getItem('token'); // Récupère le token dans le sessionStorage
    token && (window.location.href = './index.html'); // Si le token existe, redirige vers la page d'accueil
    
    document.querySelector('#login form')?.addEventListener('submit', event => { // Ajoute un écouteur d'événement sur le formulaire de connexion
        event.preventDefault(); // Empêche le comportement par défaut du formulaire
        handleLogin(event); // Appelle la fonction handleLogin lors de la soumission
    });
}
/**
 * Vérifie la validité du token d'authentification
 * - Vérifie si un token existe dans le sessionStorage
 * - Si aucun token n'existe, redirige vers la page de connexion
 * @returns {boolean} - true si le token est présent, false sinon
 */

export const checkTokenValidity = () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = './login.html';
        return false;
    }
    return true;
};




