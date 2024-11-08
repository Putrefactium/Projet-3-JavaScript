/**
 * Gestion des boutons de filtrage des projets
 * Ce module gère l'initialisation et le comportement des boutons
 * permettant de filtrer les projets par catégorie dans la galerie
 * @module filterButtons
 */

import { filterWorks, generateWorks } from "./works.js";

/**
 * Vérifie si les filtres doivent être affichés selon l'état de connexion
 * @param {HTMLElement} filtersContainer - Le conteneur des filtres
 * @returns {boolean} - True si les filtres doivent être cachés
 */
function shouldHideFilters(filtersContainer) {
    filtersContainer?.style.setProperty('display', localStorage.getItem('token') ? 'none' : '');
    return !!localStorage.getItem('token');
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

    isActive && button.setAttribute('id', 'active');

    return button;
}

/**
 * Gère le clic sur un bouton de filtre
 * @param {Event} event - L'événement de clic
 */
function handleFilterClick(event) {
    const previousActive = document.getElementById('active');

    previousActive && previousActive.removeAttribute('id');

    event.target.setAttribute('id', 'active');  
    const categoryId = parseInt(event.target.dataset.categoryId) || 0;
    const filteredWorks = filterWorks(categoryId);
    generateWorks(filteredWorks);
}

/**
 * Initialise les boutons de filtrage avec leurs écouteurs d'événements
 */
export async function initializeFilterButtons() {
    const filtersContainer = document.querySelector('.filters');
    
    shouldHideFilters(filtersContainer) && (() => {
        return;
    })();

    try {
        // Récupération des catégories depuis l'API
        const categories = await fetch('https://projet-3-javascript.onrender.com/api/categories')
            .then(response => response.json());

        const createAndAppendButton = (name, id, isActive = false) => 
            filtersContainer?.appendChild(createFilterButton(name, id, isActive));

        // Ajout du bouton "Tous"
        createAndAppendButton('Tous', '0', true);

        // Ajout des boutons de catégories avec map
        categories.map(({ name, id }) => createAndAppendButton(name, id));

        // Ajout des écouteurs d'événements
        document.querySelectorAll('.filters button')
            .forEach(button => button.addEventListener('click', handleFilterClick));
            
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
    }
}

