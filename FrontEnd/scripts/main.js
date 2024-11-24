import { generateWorks } from "./features/works/works.js";
import { loadWorks } from './services/apiService.js';
import { initializeFilterButtons } from './utils/filterButtons.js';
import { displayEditionMode, updateLoginLogoutButton, displayEditButton } from './features/admin/displayAdmin.js';

const works = await loadWorks(); // Chargement des works
generateWorks(works); // Affichage des travaux dans la galerie principale
initializeFilterButtons(); // Initialisation des boutons de filtre

document.addEventListener("DOMContentLoaded", updateLoginLogoutButton); // Affichage du bouton Login/Logout selon l'état de la connexion
document.addEventListener('DOMContentLoaded', displayEditionMode); // Affichage du container edition-mode selon l'état de la connexion
document.addEventListener('DOMContentLoaded', displayEditButton); // Affichage du bouton Modifier selon l'état de la connexion