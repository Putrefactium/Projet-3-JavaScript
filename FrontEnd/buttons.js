/**
 * Gestion des boutons de filtrage des projets
 * Ce module gère l'initialisation et le comportement des boutons
 * permettant de filtrer les projets par catégorie dans la galerie
 * @module buttons
 */

import { filterWorks } from "./works.js";

/**
 * Initialise les boutons de filtrage avec leurs écouteurs d'événements
 * - Sélectionne tous les boutons de filtre
 * - Ajoute un écouteur de clic sur chaque bouton
 * - Gère l'état actif du bouton cliqué
 * - Déclenche le filtrage des projets selon la catégorie
 */
export function initializeFilterButtons() {
    const filterButtons = document.querySelectorAll('.filters button');
    const filtersContainer = document.querySelector('.filters');
    
    return localStorage.getItem('token') 
        ? filtersContainer?.style.setProperty('display', 'none')
        : filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const previousActive = document.getElementById('active');
                if (previousActive) {
                    previousActive.removeAttribute('id');
                }
                this.setAttribute('id', 'active');
                
                const categoryId = getCategoryIdFromClass(this.classList);
                filterWorks(categoryId);
            });
        });
}

/**
 * Détermine l'ID de catégorie en fonction des classes du bouton
 * @param {DOMTokenList} classList - Liste des classes du bouton
 * @returns {number} ID de la catégorie (0 pour tous, 1 pour objets, 
 * 2 pour appartements, 3 pour hôtels)
 */
function getCategoryIdFromClass(classList) {
    if (classList.contains('items')) return 1;
    if (classList.contains('apartments')) return 2;
    if (classList.contains('hotels')) return 3;
    return 0; // Par défaut, afficher tous les works
}
