/**
 * Gestion de la modale de l'application
 * - Affichage de la galerie des projets
 * - Suppression des projets
 * - Ajout de nouveaux projets avec upload d'images
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
 * Ouvre la modale principale de gestion des projets
 * Affiche une galerie des projets avec options de suppression et d'ajout
 */
export async function openModal(event) {
    event.preventDefault();
    
    // Construction de la structure de base de la modale
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    
    // Conteneur de la modale
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Configuration du bouton de fermeture
    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.innerHTML = '&times;'; 
    closeButton.addEventListener('click', () => {
        modalContainer.remove();
    });
    
    // Configuration du titre
    const modalTitle = document.createElement('h2');
    modalTitle.textContent = 'Galerie photo';
    
    // Assemblage des éléments
    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalTitle);
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);

    // Création et configuration de la galerie
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'modal-gallery';
    
    // Récupération et affichage des projets depuis le localStorage
    const works = JSON.parse(window.localStorage.getItem("works"));
    
    works.forEach(({ id, imageUrl, title }) => {
        // Création des éléments pour chaque projet
        const figure = document.createElement('figure');
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = title;
        
        // Configuration du bouton de suppression et assignation de l'ID du projet
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.dataset.workId = id;
        
        const trashIcon = document.createElement('img');
        trashIcon.src = './assets/icons/trash.png';
        trashIcon.alt = 'Supprimer';
        trashIcon.className = 'trash-icon';

        // Ajout de l'écouteur d'événement pour la suppression du projet
        deleteButton.addEventListener('click', async (e) => {
            e.preventDefault();
            await deleteWork(id); 
        });
        
        // Assemblage des éléments
        deleteButton.appendChild(trashIcon);
        figure.appendChild(deleteButton);
        figure.appendChild(img);
        galleryContainer.appendChild(figure);
    });
    
    // Assemblage de la galerie à la modale
    modalContent.appendChild(galleryContainer);

    // Assemblage du séparateur gris
    const separator = document.createElement('hr');
    separator.className = 'modal-separator';
    modalContent.appendChild(separator);

    // Configuration du bouton d'ajout de photo
    const addPhotoButton = document.createElement('button');
    addPhotoButton.className = 'add-photo-button';
    addPhotoButton.textContent = 'Ajouter une photo';

    // Ajout de l'écouteur d'événement pour l'ajout de photo
    addPhotoButton.addEventListener('click', () => openAddPhotoForm());

    // Assemblage du bouton d'ajout de photo à la modale
    modalContent.appendChild(addPhotoButton);
    
    // Gestion de la fermeture par clic extérieur
    modalContainer.addEventListener('click', e => 
        e.target === modalContainer && modalContainer.remove()
    );
}

/**
 * Supprime un travail de la galerie
 * @param {number} workId - L'identifiant du travail à supprimer
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
 * Rafraîchit la liste des travaux depuis l'API
 * @returns {Array} Liste des travaux mise à jour
 */
async function refreshWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    window.localStorage.setItem("works", JSON.stringify(works));
    return works;
}

/**
 * Affiche et gère le formulaire d'ajout de photo
 * Inclut la validation et l'envoi des données
 */
async function openAddPhotoForm() {
    // Récupération des catégories pour le formulaire
    const categoriesResponse = await fetch("http://localhost:5678/api/categories");
    const categories = await categoriesResponse.json();
    
    // Préparation de l'interface du formulaire
    const modalContent = document.querySelector('.modal-content');
    modalContent.innerHTML = '';
    
    // Configuration des éléments du formulaire
    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        document.querySelector('.modal-container').remove();
    });
    
    const modalTitle = document.createElement('h2');
    modalTitle.textContent = 'Ajout photo';
    
    // Création du formulaire principal
    const form = document.createElement('form');
    form.className = 'add-photo-form';
    
    // Zone de dépôt de fichier
    const uploadContainer = document.createElement('div');
    uploadContainer.className = 'upload-container';
    
    // Configuration de l'input file
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'image-input';
    fileInput.name = 'image';
    fileInput.accept = 'image/png, image/jpeg';
    fileInput.style.opacity = '0';
    fileInput.style.position = 'absolute';
    fileInput.required = true;
    
    // Éléments visuels pour l'upload
    const imageIcon = document.createElement('img');
    imageIcon.src = './assets/icons/gallery.png';
    imageIcon.alt = 'Icône image';
    imageIcon.className = 'upload-icon';
    
    const addPhotoBtn = document.createElement('button');
    addPhotoBtn.type = 'button';
    addPhotoBtn.textContent = '+ Ajouter photo';
    addPhotoBtn.className = 'add-photo-input-button';
    addPhotoBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    const infoText = document.createElement('p');
    infoText.textContent = 'jpg, png : 4mo max';
    infoText.className = 'upload-info';
    
    // Prévisualisation de l'image
    const imagePreview = document.createElement('img');
    imagePreview.className = 'image-preview hidden';

    // Conteneur pour les messages d'erreur
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message hidden';
    uploadContainer.appendChild(errorContainer);
    
    // Gestion de l'upload de fichier
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (validateFile(file, errorContainer)) {
            // Récupérer le nom du fichier sans extension
            const fileName = file.name.replace(/\.[^/.]+$/, "");
            // Mettre à jour le champ titre
            titleInput.value = fileName;

            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove('hidden');
                imageIcon.classList.add('hidden');
                addPhotoBtn.classList.add('hidden');
                infoText.classList.add('hidden');
            };
            reader.readAsDataURL(file);
            // Vérifier la validité du formulaire après avoir défini le titre
            checkFormValidity(fileInput, titleInput, categorySelect, validateButton);
        } else {
            fileInput.value = '';
        }
    });

    // Création des champs du formulaire
    const formFields = document.createElement('div');
    formFields.className = 'form-fields';
    formFields.innerHTML = `
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
    `;

    // Éléments de validation et soumission
    const separator = document.createElement('hr');
    separator.className = 'modal-separator';

    const validateButton = document.createElement('button');
    validateButton.textContent = 'Valider';
    validateButton.className = 'validate-button';
    validateButton.type = 'submit';
    validateButton.style.backgroundColor = '#A7A7A7';

    // Assemblage du formulaire
    uploadContainer.append(fileInput, imageIcon, imagePreview, addPhotoBtn, infoText);
    form.append(uploadContainer, formFields, separator, validateButton);
    modalContent.append(closeButton, modalTitle, form);

    // Récupération des références pour la validation
    const titleInput = document.getElementById('title');
    const categorySelect = document.getElementById('category');
    const formInputs = [fileInput, titleInput, categorySelect];

    // Validation en temps réel pour changer couleur du bouton de validation
    formInputs.forEach(input => {
        const eventType = input === fileInput ? 'change' : 'input';
        input.addEventListener(eventType, () => {
            checkFormValidity(fileInput, titleInput, categorySelect, validateButton);
        });
    });
    
    // Gestion de la soumission du formulaire
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        try {
            // Préparation des données
            const formData = new FormData();
            formData.append('image', fileInput.files[0]);
            formData.append('title', titleInput.value);
            formData.append('category', parseInt(categorySelect.value));
    
            const token = localStorage.getItem('token');
    
            // Envoi à l'API
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
    
            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi');
            }
    
            // Mise à jour et fermeture
            const updatedWorks = await refreshWorks();
            await generateWorks(updatedWorks);
            
            const modalContainer = document.querySelector('.modal-container');
            modalContainer.remove();
    
        } catch (error) {
            errorContainer.textContent = 'Erreur lors de l\'envoi du formulaire';
            errorContainer.classList.remove('hidden');
        }
    });
}

/**
 * Vérifie la validité du formulaire et met à jour l'état du bouton
 * @param {HTMLInputElement} fileInput - Input de type file
 * @param {HTMLInputElement} titleInput - Input du titre
 * @param {HTMLSelectElement} categorySelect - Select de la catégorie
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
 * Valide le fichier image uploadé
 * @param {File} file - Fichier à valider
 * @param {HTMLElement} errorContainer - Conteneur pour les messages d'erreur
 * @returns {boolean} - true si le fichier est valide
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