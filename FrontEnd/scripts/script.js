import { generateWorks} from "./works.js";
import { initializeFilterButtons } from './filterButtons.js';
import { displayEditionMode, updateLoginLogoutButton, displayEditButton } from './display.js';
import { handleLoginRoutine } from './login.js';

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

// Affichage du bouton login/logout
document.addEventListener("DOMContentLoaded", updateLoginLogoutButton);

// Affichage du container edition-mode
document.addEventListener('DOMContentLoaded', displayEditionMode);

// Affichage du bouton Modifier
document.addEventListener('DOMContentLoaded', displayEditButton);

// Gestion des événements de la page de connexion
document.addEventListener('DOMContentLoaded', handleLoginRoutine);

