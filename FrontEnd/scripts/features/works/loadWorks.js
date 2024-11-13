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
    const storedWorks = JSON.parse(window.sessionStorage.getItem("works")); // Vérifie la présence des données dans le sessionStorage

    return storedWorks || await (async () => {
        const answer = await fetch("http://localhost:5678/api/works"); // Si storedWorks est vide, effectue une requête à l'API pour récupérer les projets
        const works = await answer.json(); // Convertit la réponse en JSON
        window.sessionStorage.setItem("works", JSON.stringify(works)); // Stocke les données dans le sessionStorage
        return works; // Retourne les données récupérées
    })();
}
