import {generateWorks} from "./works.js";
import { initializeFilterButtons } from './buttons.js';
import { handleLogin, updateLoginLogoutButton, displayEditionMode } from './login.js';

// Initialisation : Récupération des travaux depuis le localStorage ou l'API
let works = window.localStorage.getItem("works");

if (!works){
    const answer = await fetch("http://localhost:5678/api/works");
    works = await answer.json();

    const valueWorks = JSON.stringify(works);
    window.localStorage.setItem("works", valueWorks);
} else {
    works = JSON.parse(works);
}

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



