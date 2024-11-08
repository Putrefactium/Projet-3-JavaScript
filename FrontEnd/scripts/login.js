/**
 * Gestion de l'authentification et des fonctionnalités liées à la connexion
 * Ce module gère le processus de connexion, la déconnexion, et l'affichage
 * des éléments d'interface conditionnels à l'état de connexion de l'utilisateur
 * @module login
 */

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
 * - Valide le format de l'adresse email avec une expression régulière
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError("Veuillez entrer une adresse email valide");
        return false;
    }
    return true;
};

/**
 * Envoie une requête de connexion à l'API
 * - Effectue une requête POST vers l'endpoint de connexion
 * - Envoie les identifiants au format JSON
 * - Retourne la réponse de l'API
 * @param {string} email - L'email de l'utilisateur
 * @param {string} password - Le mot de passe de l'utilisateur
 * @returns {Promise<Object>} La réponse de l'API contenant le token
 */
const loginToApi = async (email, password) => {
    const response = await fetch('https://projet-3-javascript.onrender.com/api/users/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    return await response.json();
};

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
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDisplay = document.getElementById('error-message');
    const showError = configureErrorDisplay(errorDisplay);

    if (!validateInputs(email, password, showError)) {
        return;
    }

    try {
        const data = await loginToApi(email, password);
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            window.location.href = './index.html';
        }
    } catch (error) {
        console.error('Erreur:', error);
        showError("Une erreur est survenue lors de la connexion");
    }
}

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
    const isLoginPage = window.location.pathname.includes('login.html');
    const token = localStorage.getItem('token');
    
    isLoginPage && token && (window.location.href = './index.html');
    
    isLoginPage && document.querySelector('#login form')?.addEventListener('submit', event => {
        event.preventDefault();
        handleLogin(event);
    });
}




