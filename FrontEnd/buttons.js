import { generateWorks } from "./works.js";

export function initializeFilterButtons() {
    const filterButtons = document.querySelectorAll('.filters button');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Gestion de l'état actif
            const previousActive = document.getElementById('active');
            if (previousActive) {
                previousActive.removeAttribute('id');
            }
            this.setAttribute('id', 'active');
            
            // Déduire le categoryId à partir de la classe
            const categoryId = getCategoryIdFromClass(this.classList);
            
            // Filtrer les works
            filterWorks(categoryId);
        });
    });
}

function getCategoryIdFromClass(classList) {
    if (classList.contains('all')) return 0;    // Afficher tous les works
    if (classList.contains('items')) return 1;
    if (classList.contains('apartments')) return 2;
    if (classList.contains('hotels')) return 3;
    return 0; // Par défaut, afficher tous les works
}

function filterWorks(categoryId) {
    const works = JSON.parse(window.localStorage.getItem("works"));
    
    let filteredWorks;
    if (categoryId === 0) {
        filteredWorks = works;  // Retourne tous les works sans filtre
    } else {
        filteredWorks = works.filter(work => work.categoryId === categoryId);  // Filtre les works par catégorie
    }
    
    // Vider la galerie avant d'afficher les nouveaux works
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    
    // Générer les nouveaux works filtrés
    generateWorks(filteredWorks);
}