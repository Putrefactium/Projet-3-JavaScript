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
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = '';
    
    works.forEach(({ imageUrl, title }) => {  
        const figure = document.createElement("figure");
        
        const img = document.createElement("img");
        img.src = imageUrl;        
        img.alt = title;          
        
        const figcaption = document.createElement("figcaption");
        figcaption.innerText = title;  
        
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}

/**
 * Filtre les travaux selon une catégorie donnée et met à jour l'affichage
 * @param {number} categoryId - L'identifiant de la catégorie à filtrer (0 pour tous les travaux)
 */
export function filterWorks(categoryId) {
    const works = JSON.parse(window.localStorage.getItem("works"));
    
    const filteredWorks = categoryId === 0 
        ? works 
        : works.filter(work => work.categoryId === categoryId);
    
    // Vider la galerie avant d'afficher les nouveaux works
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    
    // Générer les nouveaux works filtrés
    generateWorks(filteredWorks);
}