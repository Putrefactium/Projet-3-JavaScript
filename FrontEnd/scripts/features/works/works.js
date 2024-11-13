/**
 * Gestion de l'affichage des projets dans la galerie principale
 * - Génération dynamique des éléments HTML
 * - Affichage des images et titres des projets
 * @module works
 */

import { loadWorks } from './loadWorks.js';

/**
 * Génère l'affichage des works dans la galerie principale
 * @param {Array} works - Tableau contenant les works à afficher
 */
export async function generateWorks(works) {
    // Si works est une Promise, attendons sa résolution
    if (works instanceof Promise) {
        works = await works;
    }
    
    const gallery = document.querySelector(".gallery"); // Sélectionne la galerie principale
    gallery.innerHTML = ''; // Efface le contenu de la galerie avant d'afficher les nouveaux works

    // Vérification que works est un tableau valide
    if (!Array.isArray(works)) {
        console.error("works n'est pas un tableau valide:", works); // Si works n'est pas un tableau, affiche un message d'erreur
        return;
    }
    // Pour chaque work, crée un élément figure avec une image et un titre
    works.forEach(({ imageUrl, title }) => {  
        const figure = document.createElement("figure"); // Crée un élément figure
        
        const img = document.createElement("img"); // Crée un élément img avec les attributs src et alt
        img.src = imageUrl;        
        img.alt = title;          
        
        const figcaption = document.createElement("figcaption"); // Crée un élément figcaption
        figcaption.innerText = title;  
        
        figure.appendChild(img); 
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}

/**
 * Filtre les works selon une catégorie donnée et met à jour l'affichage
 * @param {number} categoryId - L'identifiant de la catégorie à filtrer (0 pour tous les works)
 */
export async function filterWorks(categoryId) {
    const works = await loadWorks(); // Charge les works depuis le sessionStorage ou l'API
    
    const filteredWorks = categoryId === 0 
        ? works 
        : works.filter(work => work.categoryId === categoryId); // Filtre les works selon la catégorie donnée
    
    return filteredWorks;
}