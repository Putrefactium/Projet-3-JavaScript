/**
 * Gestion de l'affichage des projets dans la galerie principale
 * - Génération dynamique des éléments HTML
 * - Affichage des images et titres des projets
 */

/**
 * Génère l'affichage des travaux dans la galerie principale
 * @param {Array} works - Tableau contenant les travaux à afficher
 */
export async function generateWorks(works) {
    // Sélectionner la galerie
    const gallery = document.querySelector(".gallery");
    
    // Vider la galerie existante
    gallery.innerHTML = '';
    
    // Générer les nouveaux éléments
    works.forEach(work => {
        // Création du conteneur pour chaque projet
        const figure = document.createElement("figure");
        
        // Configuration de l'image du projet
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;
        
        // Configuration du titre du projet
        const figcaption = document.createElement("figcaption");
        figcaption.innerText = work.title;
        
        // Assemblage des éléments dans la galerie
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}