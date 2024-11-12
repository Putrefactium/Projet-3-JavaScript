import { generateWorks } from "./features/works/works.js";
import { initializeFilterButtons } from './components/filterButtons.js';
import { displayEditionMode, updateLoginLogoutButton, displayEditButton } from './features/admin/displayAdmin.js';
import { loadWorks } from './features/works/loadWorks.js';
import { sendContactForm } from './features/contact/contact.js';

const works = await loadWorks();

if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    generateWorks(works); // Affichage des travaux dans la galerie principale
    initializeFilterButtons(); // Initialisation des boutons de filtre
}

document.addEventListener("DOMContentLoaded", updateLoginLogoutButton); // Affichage du bouton Login/Logout
document.addEventListener('DOMContentLoaded', displayEditionMode); // Affichage du container edition-mode
document.addEventListener('DOMContentLoaded', displayEditButton); // Affichage du bouton Modifier
document.addEventListener('DOMContentLoaded', sendContactForm); // Envoi du formulaire de contact
