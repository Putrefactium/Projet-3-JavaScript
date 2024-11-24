/**
 * Gestion des boutons de filtrage des projets
 * Ce module gère l'initialisation et le comportement des boutons
 * permettant de filtrer les projets par catégorie dans la galerie
 * @module filterButtons
 */

import { filterWorks, generateWorks } from "../features/works/works.js";
import { fetchCategories } from "../services/apiService.js";

/**
 * Initialise les boutons de filtrage avec leurs écouteurs d'événements
 */
export async function initializeFilterButtons() {
    const filtersContainer = document.querySelector('.filters');
    
    shouldHideFilters(filtersContainer) && (() => { // Si les filtres doivent être masqués, on sort de la fonction
        return;
    })();

    try {
        // Récupération des catégories depuis l'API
        const categories = await fetchCategories();

        const createAndAppendButton = (name, id, isActive = false) =>  // Crée un bouton de filtre et l'ajoute au container des filtres
            filtersContainer?.appendChild(createFilterButton(name, id, isActive)); 

        // Ajout du bouton "Tous"
        createAndAppendButton('Tous', '0', true);

        // Ajout des autres boutons de catégories avec map
        categories.map(({ name, id }) => createAndAppendButton(name, id));

        // Ajout des écouteurs d'événements sur chaque bouton de filtre
        document.querySelectorAll('.filters button')
            .forEach(button => button.addEventListener('click', handleFilterClick));
            
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
    }
}

/**
 * Vérifie si les filtres doivent être affichés selon l'état de connexion
 * @param {HTMLElement} filtersContainer - Le conteneur des filtres
 * @returns {boolean} - True si les filtres doivent être cachés
 */
function shouldHideFilters(filtersContainer) {
    filtersContainer?.style.setProperty('display', sessionStorage.getItem('token') ? 'none' : ''); // Si le token est présent, masque le container des filtres, sinon l'affiche
    return !!sessionStorage.getItem('token'); // Retourne true si le token est présent, sinon false
}

/**
 * Crée un bouton de filtre
 * @param {string} text - Le texte du bouton
 * @param {string|number} categoryId - L'ID de la catégorie
 * @param {boolean} isActive - Si le bouton doit être actif par défaut
 * @returns {HTMLButtonElement} - Le bouton créé
 */
function createFilterButton(text, categoryId, isActive = false) {
    const button = document.createElement('button'); 
    button.textContent = text; 
    button.dataset.categoryId = categoryId;

    isActive && button.setAttribute('id', 'active'); // Si le bouton doit être actif par défaut, ajoute l'id "active"

    return button;
}

/**
 * Gère le clic sur un bouton de filtre
 * @param {Event} event - L'événement de clic
 */
function handleFilterClick(event) {
    const previousActive = document.getElementById('active'); // Sélectionne le bouton actif précédent

    previousActive && previousActive.removeAttribute('id'); // Si le bouton actif précédent existe, retire l'id "active"

    event.target.setAttribute('id', 'active'); // Ajoute l'id "active" au bouton cliqué
    const categoryId = parseInt(event.target.dataset.categoryId) || 0; // Récupère l'ID de la catégorie du bouton cliqué
    const filteredWorks = filterWorks(categoryId); // Filtre les works selon la catégorie du bouton cliqué
    generateWorks(filteredWorks); // Génère l'affichage des works filtrés
}