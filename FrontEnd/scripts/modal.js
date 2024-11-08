/**
 * Module de gestion de la modale de l'application
 * Ce module gère l'affichage et les interactions avec la fenêtre modale permettant de :
 * - Visualiser la galerie des projets existants
 * - Supprimer des projets de la galerie
 * - Ajouter de nouveaux projets avec upload d'images
 * - Gérer les formulaires et la validation des données
 * @module modal
 */

import { generateWorks } from './works.js';

// Initialisation : Récupération des travaux depuis le localStorage ou l'API
let works = window.localStorage.getItem("works");

if (!works){
    const answer = await fetch("http://localhost:5678/api/works");
    works = await answer.json();

    const valueWorks = JSON.stringify(works);
    window.localStorage.setItem("works", valueWorks);
} else {
    works = JSON.parse(works);
}

/**
 * Crée la structure HTML de base de la modale
 * @returns {Object} Objet contenant les références vers le container et le contenu de la modale
 * @property {HTMLElement} modalContainer - Élément conteneur principal de la modale
 * @property {HTMLElement} modalContent - Élément contenant le contenu de la modale
 */
function createModalStructure() {
    const modalHTML = `
        <div class="modal-container">
            <div class="modal-content"></div>
        </div>
    `;
    const container = document.createRange().createContextualFragment(modalHTML);
    const modalContainer = container.querySelector('.modal-container');
    const modalContent = container.querySelector('.modal-content');
    
    modalContainer.addEventListener('click', e => 
        e.target === modalContainer && modalContainer.remove()
    );
    
    return { modalContainer, modalContent };
}

/**
 * Crée l'en-tête de la modale avec le bouton de fermeture et le titre
 * @param {HTMLElement} modalContainer - Conteneur principal de la modale
 * @returns {DocumentFragment} Fragment contenant l'en-tête de la modale
 */
function createModalHeader(modalContainer) {
    const headerHTML = `
        <button class="modal-close">&times;</button>
        <h2>Galerie photo</h2>
    `;
    const header = document.createRange().createContextualFragment(headerHTML);
    
    header.querySelector('.modal-close')
        .addEventListener('click', () => modalContainer.remove());
    
    return header;
}

/**
 * Crée un élément de la galerie avec image et bouton de suppression
 * @param {Object} work - Objet contenant les informations du projet
 * @param {number} work.id - Identifiant unique du projet
 * @param {string} work.imageUrl - URL de l'image du projet
 * @param {string} work.title - Titre du projet
 * @returns {DocumentFragment} Fragment contenant l'élément de galerie
 */
function createGalleryItem({ id, imageUrl, title }) {
    const itemHTML = `
        <figure>
            <button class="delete-button" data-work-id="${id}">
                <img src="./assets/icons/trash.png" alt="Supprimer" class="trash-icon">
            </button>
            <img src="${imageUrl}" alt="${title}">
        </figure>
    `;
    const item = document.createRange().createContextualFragment(itemHTML);
    
    item.querySelector('.delete-button').addEventListener('click', async (e) => {
        e.preventDefault();
        await deleteWork(id);
    });
    
    return item;
}

/**
 * Crée la galerie complète à partir d'un tableau de projets
 * @param {Array} works - Tableau des projets à afficher
 * @returns {DocumentFragment} Fragment contenant la galerie complète
 */
function createGallery(works) {
    const galleryHTML = `<div class="modal-gallery"></div>`;
    const gallery = document.createRange().createContextualFragment(galleryHTML);
    const galleryContainer = gallery.querySelector('.modal-gallery');
    
    works.forEach(work => {
        const galleryItem = createGalleryItem(work);
        galleryContainer.appendChild(galleryItem);
    });
    
    return gallery;
}

/**
 * Crée le pied de page de la modale avec le bouton d'ajout de photo
 * @returns {DocumentFragment} Fragment contenant le footer de la modale
 */
function createModalFooter() {
    const footerHTML = `
        <hr class="modal-separator">
        <button class="add-photo-button">Ajouter une photo</button>
    `;
    const footer = document.createRange().createContextualFragment(footerHTML);
    
    footer.querySelector('.add-photo-button')
        .addEventListener('click', () => openAddPhotoForm());
    
    return footer;
}

/**
 * Ouvre la modale et initialise son contenu
 * Cette fonction gère l'affichage initial de la modale avec la galerie
 * @param {Event} event - Événement déclencheur
 */
export async function openModal(event) {
    event.preventDefault();
    
    // Création de la structure de base
    const { modalContainer, modalContent } = createModalStructure();
    
    // Ajout des différentes sections
    modalContent.appendChild(createModalHeader(modalContainer));
    
    const works = JSON.parse(window.localStorage.getItem("works"));
    modalContent.appendChild(createGallery(works));
    
    modalContent.appendChild(createModalFooter());
    
    // Ajout à la page
    document.body.appendChild(modalContainer);
}

/**
 * Supprime un projet de la galerie et met à jour l'affichage
 * Cette fonction gère la suppression côté API et interface
 * @param {number} workId - Identifiant du projet à supprimer
 * @throws {Error} Lance une erreur si la suppression échoue
 */
async function deleteWork(workId) {

    // Tentative de suppression du projet via l'API
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Vérification de la réponse de l'API
        if (response.ok) {

            // Mise à jour des données et rafraîchissement de l'affichage
            const updatedWorks = await refreshWorks();
            generateWorks(updatedWorks); 
            
            // Rafraîchissement de la modale
            const modalContainer = document.querySelector('.modal-container');
            modalContainer.remove();
            openModal(new Event('click'));
        } else {
            throw new Error('Erreur lors de la suppression');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
    }
}

/**
 * Rafraîchit la liste des projets depuis l'API
 * Met à jour le localStorage avec les nouvelles données
 * @returns {Promise<Array>} Tableau mis à jour des projets
 */
async function refreshWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    window.localStorage.setItem("works", JSON.stringify(works));
    return works;
}

/**
 * Crée les éléments de base de la modale d'ajout de photo
 * - Vide le contenu existant
 * - Crée l'en-tête avec le bouton de fermeture et le titre
 * - Configure l'événement de fermeture
 * @returns {Object} Objet contenant les références vers le contenu et l'en-tête
 */
function createAddPhotoBaseElements() {
    const modalContent = document.querySelector('.modal-content');
    modalContent.innerHTML = '';

    const headerHTML = `
        <button class="modal-close">&times;</button>
        <h2>Ajout photo</h2>
    `;
    const header = document.createRange().createContextualFragment(headerHTML);
    
    header.querySelector('.modal-close').addEventListener('click', () => {
        document.querySelector('.modal-container').remove();
    });

    return { modalContent, header };
}

/**
 * Crée la zone d'upload de photo
 * - Crée l'input de type file masqué
 * - Ajoute les éléments visuels (icône, bouton, texte d'info)
 * - Configure la prévisualisation de l'image
 * @returns {DocumentFragment} Fragment contenant la zone d'upload
 */
function createUploadZone() {
    const uploadHTML = `
        <div class="upload-container">
            <input type="file" 
                id="image-input" 
                name="image" 
                accept="image/png, image/jpeg" 
                required 
                style="opacity: 0; position: absolute;">
            <img src="./assets/icons/gallery.png" alt="Icône image" class="upload-icon">
            <img class="image-preview hidden">
            <button type="button" class="add-photo-input-button">+ Ajouter photo</button>
            <p class="upload-info">jpg, png : 4mo max</p>
            <div class="error-message hidden"></div>
        </div>
    `;
    return document.createRange().createContextualFragment(uploadHTML);
}

/**
 * Crée les champs du formulaire d'ajout de photo
 * - Génère les champs titre et catégorie
 * - Trie et affiche les catégories disponibles
 * - Ajoute le bouton de validation
 * @param {Array} categories - Liste des catégories disponibles
 * @returns {DocumentFragment} Fragment contenant les champs du formulaire
 */
function createFormFields(categories) {
    const formHTML = `
        <div class="form-fields">
            <div class="form-group">
                <label for="title">Titre</label>
                <input type="text" id="title" name="title" required>
            </div>
            <div class="form-group">
                <label for="category">Catégorie</label>
                <select id="category" name="category" required>
                    ${categories
                        .sort((a, b) => (a.id === 1 ? -1 : b.id === 1 ? 1 : 0))
                        .map(category => `<option value="${category.id}">${category.name}</option>`)
                        .join('')}
                </select>
            </div>
        </div>
        <hr class="modal-separator">
        <button type="submit" class="validate-button" style="background-color: #A7A7A7">
            Valider
        </button>
    `;
    return document.createRange().createContextualFragment(formHTML);
}

/**
 * Configure les événements liés à l'upload de photo
 * - Gère le clic sur le bouton d'ajout
 * - Configure la prévisualisation de l'image
 * - Met à jour l'interface selon l'état du formulaire
 * @param {HTMLFormElement} form - Le formulaire d'ajout de photo
 * @param {HTMLElement} errorContainer - Conteneur pour les messages d'erreur
 * @returns {Object} Références vers les éléments clés du formulaire
 */
function setupUploadEvents(form, errorContainer) {
    const fileInput = form.querySelector('#image-input');
    const imagePreview = form.querySelector('.image-preview');
    const imageIcon = form.querySelector('.upload-icon');
    const addPhotoBtn = form.querySelector('.add-photo-input-button');
    const infoText = form.querySelector('.upload-info');
    const titleInput = form.querySelector('#title');
    const categorySelect = form.querySelector('#category');
    const validateButton = form.querySelector('.validate-button');

    addPhotoBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => handleFileUpload(e, {
        fileInput,
        titleInput,
        imagePreview,
        imageIcon,
        addPhotoBtn,
        infoText,
        categorySelect,
        validateButton,
        errorContainer
    }));

    return { fileInput, titleInput, categorySelect, validateButton };
}

/**
 * Gère l'upload et la prévisualisation d'un fichier
 * - Valide le fichier sélectionné
 * - Pré-remplit le titre avec le nom du fichier
 * - Affiche la prévisualisation de l'image
 * - Met à jour l'interface utilisateur
 * @param {Event} e - Événement de changement de fichier
 * @param {Object} elements - Références vers les éléments de l'interface
 */
function handleFileUpload(e, elements) {
    const file = e.target.files[0];
    if (validateFile(file, elements.errorContainer)) {
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        elements.titleInput.value = fileName;

        const reader = new FileReader();
        reader.onload = (e) => {
            elements.imagePreview.src = e.target.result;
            elements.imagePreview.classList.remove('hidden');
            elements.imageIcon.classList.add('hidden');
            elements.addPhotoBtn.classList.add('hidden');
            elements.infoText.classList.add('hidden');
        };
        reader.readAsDataURL(file);
        
        checkFormValidity(
            elements.fileInput,
            elements.titleInput,
            elements.categorySelect,
            elements.validateButton
        );
    } else {
        elements.fileInput.value = '';
    }
}

/**
 * Ouvre et initialise le formulaire d'ajout de photo
 * - Récupère les catégories depuis l'API
 * - Crée la structure du formulaire
 * - Configure les événements
 * - Gère la soumission du formulaire
 */
async function openAddPhotoForm() {
    const categories = await fetch("http://localhost:5678/api/categories")
        .then(response => response.json());
    
    const { modalContent, header } = createAddPhotoBaseElements();
    
    const form = document.createElement('form');
    form.className = 'add-photo-form';
    
    const uploadZone = createUploadZone();
    const formFields = createFormFields(categories);
    form.append(uploadZone, formFields);
    
    modalContent.append(header, form);
    
    const { fileInput, titleInput, categorySelect } = setupUploadEvents(form, form.querySelector('.error-message'));
    
    form.addEventListener('submit', e => handleFormSubmit(e, { fileInput, titleInput, categorySelect }));
}

/**
 * Gère la soumission du formulaire d'ajout de photo
 * - Crée et envoie les données du formulaire à l'API
 * - Met à jour la galerie en cas de succès
 * - Gère l'affichage des erreurs
 * @param {Event} e - Événement de soumission du formulaire
 * @param {Object} formElements - Références vers les éléments du formulaire
 */

async function handleFormSubmit(e, { fileInput, titleInput, categorySelect }) {
    e.preventDefault();
    const errorContainer = document.querySelector('.error-message');

    try {
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        formData.append('title', titleInput.value);
        formData.append('category', parseInt(categorySelect.value));

        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (!response.ok) throw new Error('Erreur lors de l\'envoi');

        const updatedWorks = await refreshWorks();
        await generateWorks(updatedWorks);
        
        document.querySelector('.modal-container').remove();
        openModal(new Event('click'));

    } catch (error) {
        errorContainer.textContent = 'Erreur lors de l\'envoi du formulaire';
        errorContainer.classList.remove('hidden');
    }
}

/**
 * Vérifie la validité du formulaire d'ajout de photo
 * Met à jour l'état du bouton de validation en fonction des champs
 * @param {HTMLInputElement} fileInput - Champ de sélection du fichier
 * @param {HTMLInputElement} titleInput - Champ du titre
 * @param {HTMLSelectElement} categorySelect - Menu déroulant des catégories
 * @param {HTMLButtonElement} validateButton - Bouton de validation
 */
function checkFormValidity(fileInput, titleInput, categorySelect, validateButton) {
    const hasFile = fileInput.files && fileInput.files.length > 0;
    const hasTitle = titleInput.value.trim() !== '';
    const hasCategory = categorySelect.value !== '';
    const isFileValid = hasFile && validateFile(fileInput.files[0]);

    if (hasFile && hasTitle && hasCategory && isFileValid) {
        validateButton.style.backgroundColor = '#1D6154';
    } else {
        validateButton.style.backgroundColor = '#A7A7A7';
    }
}

/**
 * Valide un fichier image selon les critères :
 * - Type de fichier (jpg, png)
 * - Taille maximum (4Mo)
 * @param {File} file - Fichier à valider
 * @param {HTMLElement} [errorContainer] - Conteneur optionnel pour les messages d'erreur
 * @returns {boolean} true si le fichier est valide, false sinon
 */
function validateFile(file, errorContainer = null) {
    if (errorContainer) {
        errorContainer.textContent = '';
        errorContainer.classList.add('hidden');
    }

    if (!file) {
        if (errorContainer) {
            errorContainer.textContent = 'Veuillez sélectionner un fichier';
            errorContainer.classList.remove('hidden');
        }
        return false;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
        if (errorContainer) {
            errorContainer.textContent = 'Format de fichier invalide. Veuillez sélectionner une image JPG ou PNG';
            errorContainer.classList.remove('hidden');
        }
        return false;
    }

    const maxSize = 4 * 1024 * 1024; // 4Mo
    if (file.size > maxSize) {
        if (errorContainer) {
            errorContainer.textContent = 'Le fichier est trop volumineux. La taille maximum est de 4Mo';
            errorContainer.classList.remove('hidden');
        }
        return false;
    }

    return true;
}