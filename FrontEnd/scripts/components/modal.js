/**
 * Module de gestion de la modale de l'application
 * Ce module gère l'affichage et les interactions avec la fenêtre modale permettant de :
 * - Visualiser la galerie des projets existants
 * - Supprimer des projets de la galerie
 * - Ajouter de nouveaux projets avec upload d'images
 * - Gérer les formulaires et la validation des données
 * @module modal
 */

import { generateWorks } from '../features/works/works.js';
import { loadWorks, deleteWork, refreshWorks, fetchCategories, postFormData } from '../services/apiService.js';
import { sanitizer } from '../core/sanitizer.js';
import { checkTokenValidity } from '../features/auth/login.js';

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
        e.target === modalContainer && modalContainer.remove() // Si la cible du clic est la modal, on la supprime pour gérer le clic en dehors qui ferme la modal
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
        .addEventListener('click', () => modalContainer.remove()); // Ajoute un écouteur d'événement sur le bouton de fermeture qui ferme la modal
    
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
        e.preventDefault(); // Empêche le comportement par défaut du bouton
        await handleWorkDeletion(id); // Appelle la fonction deleteWork pour supprimer le work lors de la pression du bouton de suppression

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
        .addEventListener('click', () => openAddPhotoForm()); // Ajoute un écouteur d'événement sur le bouton d'ajout de photo qui ouvre la modal d'ajout de photo
    
    return footer;
}

/**
 * Ouvre la modale et initialise son contenu
 * Cette fonction gère l'affichage initial de la modale avec la galerie
 * @param {Event} event - Événement déclencheur
 */
export async function openModal(event) {
    event.preventDefault(); // Empêche le comportement par défaut de l'événement
    
    const { modalContainer, modalContent } = createModalStructure(); // Création de la structure de base
    modalContent.appendChild(createModalHeader(modalContainer)); // Ajoute l'en-tête de la modale
    
    const works = await loadWorks(); // Récupère les works depuis l'API

    modalContent.appendChild(createGallery(works)); // Ajoute la galerie à la modale
    modalContent.appendChild(createModalFooter()); // Ajoute le pied de page de la modale
    
    document.body.appendChild(modalContainer); // Ajout à la page
}

/**
 * Gère la suppression d'un work
 * - Vérifie la validité du token
 * - Supprime le work via l'API
 * - Rafraîchit la galerie
 */
async function handleWorkDeletion(workId) {
    if (!checkTokenValidity()) return;

    try {
        await deleteWork(workId); // Supprime le work via l'API
        const updatedWorks = await refreshWorks(); // Rafraîchit les works dans le sessionStorage
        generateWorks(updatedWorks); // Rafraîchit le contenu de la galerie dans le DOM
        
        const modalContainer = document.querySelector('.modal-container');
        modalContainer.remove(); // Ferme la modal
        openModal(new Event('click')); // Rouvre la modal à jour
    } catch (error) {
        console.error('Erreur lors de la suppression du projet', error); // Gère les erreurs
    }
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
    
    header.querySelector('.modal-close').addEventListener('click', () => { // Ajoute un écouteur d'événement sur le bouton de fermeture de la modal
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
 * Crée les champs du formulaire d'ajout de photo : Titre et Catégorie
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
                        .sort((a, b) => (a.id === 1 ? -1 : b.id === 1 ? 1 : 0)) // Trie les catégories par ordre alphabétique
                        .map(category => `<option value="${category.id}">${category.name}</option>`) // Crée les options pour chaque catégorie
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

    addPhotoBtn.addEventListener('click', () => fileInput.click()); // Ajoute un écouteur d'événement sur le bouton d'ajout de photo qui ouvre la fenêtre de sélection de fichier

    fileInput.addEventListener('change', (e) => handleFileUpload(e, { // Ajoute un écouteur d'événement sur le champ de sélection de fichier qui gère l'upload et la prévisualisation de l'image
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
    const file = e.target.files[0]; // Récupère le fichier sélectionné
    if (validateFile(file, elements.errorContainer)) { // Valide le fichier
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remplace l'extension du fichier par une chaîne vide
        elements.titleInput.value = fileName; // Pré-remplit le titre avec le nom du fichier

        const reader = new FileReader(); 
        reader.onload = (e) => { 
            elements.imagePreview.src = e.target.result; // Prévisualise l'image
            elements.imagePreview.classList.remove('hidden'); // Affiche la prévisualisation
            elements.imageIcon.classList.add('hidden'); // Masque l'icône d'image
            elements.addPhotoBtn.classList.add('hidden'); // Masque le bouton d'ajout de photo
            elements.infoText.classList.add('hidden'); // Masque le texte d'info
        };
        reader.readAsDataURL(file); 
        
        checkFormValidity( // Vérifie la validité du formulaire
            elements.fileInput, 
            elements.titleInput,
            elements.categorySelect,
            elements.validateButton
        );
    } else {
        elements.fileInput.value = ''; // Réinitialise le champ de sélection de fichier
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
    const categories = await fetchCategories(); // Récupère les catégories depuis l'API
    const { modalContent, header } = createAddPhotoBaseElements(); // Crée la structure de base
    
    const form = document.createElement('form'); // Crée le formulaire
    form.className = 'add-photo-form'; // Ajoute une classe au formulaire
    
    const uploadZone = createUploadZone(); // Crée la zone d'upload
    const formFields = createFormFields(categories); // Crée les champs du formulaire
    form.append(uploadZone, formFields); // Ajoute la zone d'upload et les champs au formulaire
    
    modalContent.append(header, form); // Ajoute l'en-tête et le formulaire à la modal
    
    const { fileInput, titleInput, categorySelect } = setupUploadEvents(form, form.querySelector('.error-message')); // Configure les événements liés à l'upload de photo
    
    form.addEventListener('submit', e => handleFormSubmit(e, { fileInput, titleInput, categorySelect })); // Ajoute un écouteur d'événement sur le formulaire qui gère la soumission
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
    e.preventDefault(); // Empêche le comportement par défaut du formulaire
    if (!checkTokenValidity()) return;
    
    const errorContainer = document.querySelector('.error-message'); // Récupère le conteneur d'erreur

    try {
        // Sanitize le titre pour éviter les XSS et SQLi
        const sanitizedTitle = sanitizer.sanitizeString(titleInput.value.trim());

        // Validation supplémentaire du titre
        if (sanitizedTitle.length < 3 || sanitizedTitle.length > 100) {
            throw new Error('Le titre doit contenir entre 3 et 100 caractères');
        }

        const formData = new FormData(); // Crée un objet FormData pour envoyer les données du formulaire
        formData.append('image', fileInput.files[0]); // Ajoute le fichier sélectionné au formulaire
        formData.append('title', sanitizedTitle); // Ajoute le titre sanitizé au formulaire
        formData.append('category', parseInt(categorySelect.value)); // Ajoute la catégorie sélectionnée au formulaire

        // Validation supplémentaire pour la catégorie
        const categoryId = parseInt(categorySelect.value); 
        if (isNaN(categoryId) || categoryId < 1) { 
            throw new Error('Catégorie invalide');
        }

        await postFormData(formData); // Envoie les données du formulaire à l'API

        const updatedWorks = await refreshWorks(); // Met à jour les works dans le sessionStorage
        await generateWorks(updatedWorks); // Rafraîchit la galerie
        
        document.querySelector('.modal-container').remove(); // Ferme la modal
        openModal(new Event('click')); // Rafraîchit la galerie

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
    const hasFile = fileInput.files && fileInput.files.length > 0; // Vérifie si un fichier a bien été sélectionné
    const hasTitle = titleInput.value.trim() !== ''; // Vérifie si le titre n'est pas vide
    const hasCategory = categorySelect.value !== ''; // Vérifie si une catégorie a bien été sélectionnée
    const isFileValid = hasFile && validateFile(fileInput.files[0]); // Vérifie si le fichier est valide

    if (hasFile && hasTitle && hasCategory && isFileValid) { // Si tout est valide, change la couleur du bouton de validation
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
        errorContainer.textContent = ''; // Réinitialise le conteneur d'erreur
        errorContainer.classList.add('hidden'); // Masque le conteneur d'erreur
    }

    if (!file) { // Si aucun fichier n'a été sélectionné, affiche un message d'erreur
        if (errorContainer) {
            errorContainer.textContent = 'Veuillez sélectionner un fichier';
            errorContainer.classList.remove('hidden');
        }
        return false;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg']; // Liste des types de fichiers valides
    if (!validTypes.includes(file.type)) { // Si le type de fichier n'est pas valide, affiche un message d'erreur
        if (errorContainer) {
            errorContainer.textContent = 'Format de fichier invalide. Veuillez sélectionner une image JPG ou PNG';
            errorContainer.classList.remove('hidden');
        }
        return false;
    }

    const maxSize = 4 * 1024 * 1024; // 4Mo maximum
    if (file.size > maxSize) { // Si le fichier est trop volumineux, affiche un message d'erreur
        if (errorContainer) {
            errorContainer.textContent = 'Le fichier est trop volumineux. La taille maximum est de 4Mo';
            errorContainer.classList.remove('hidden');
        }
        return false;
    }

    return true;
}