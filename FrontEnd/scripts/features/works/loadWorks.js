/**
 * Module de chargement des projets 
 * Ce module gère le chargement des projets depuis le sessionStorage ou l'API
 * @module loadWorks
 */

/**
 * Charge les projets depuis le sessionStorage ou l'API si non présents en cache
 * - Vérifie d'abord la présence des données dans le sessionStorage
 * - Si absent, effectue une requête à l'API pour récupérer les projets
 * - Stocke les données récupérées dans le sessionStorage
 * @returns {Promise<Array>} Tableau des projets chargés
 */
export async function loadWorks() {
    const storedWorks = JSON.parse(window.sessionStorage.getItem("works"));

    return storedWorks || await (async () => {
        const answer = await fetch("http://localhost:5678/api/works");
        const works = await answer.json();
        window.sessionStorage.setItem("works", JSON.stringify(works));
        return works;
    })();
}
