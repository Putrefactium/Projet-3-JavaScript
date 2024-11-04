import { generateWorks} from "./works.js";
import { initializeFilterButtons } from './buttons.js';
import { handleLogin, updateLoginLogoutButton, displayEditionMode } from './login.js';

// Initialisation : Récupération des travaux depuis le localStorage ou l'API
let works = JSON.parse(window.localStorage.getItem("works")) ?? await (async () => {
    const answer = await fetch("http://localhost:5678/api/works");
    const works = await answer.json();
    window.localStorage.setItem("works", JSON.stringify(works));
    return works;
})();

// Affichage des travaux dans la galerie principale
generateWorks(works);

// Initialisation des boutons de filtre
initializeFilterButtons();

// Gestion de la connexion et de la déconnexion
handleLogin();

// Affichage du bouton login/logout
document.addEventListener("DOMContentLoaded", updateLoginLogoutButton);

// Affichage du bouton edition-mode
window.addEventListener('DOMContentLoaded', displayEditionMode);



