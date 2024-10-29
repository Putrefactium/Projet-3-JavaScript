let works = window.localStorage.getItem("works");

if (!works){
    const answer = await fetch("http://localhost:5678/api/works");
    works = await answer.json();

    const valueWorks = JSON.stringify(works);
    window.localStorage.setItem("works", valueWorks);
} else {
    works = JSON.parse(works);
}

// Fonction principale d'authentification
export async function handleLogin(event) {
    if (!window.location.pathname.includes('login.html')) {
        return;
    }

    // Récupération des valeurs du formulaire
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDisplay = document.getElementById('error-message');

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: email, 
                password: password 
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Stockage des informations de connexion
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            
            // Redirection vers la page d'accueil
            window.location.href = './index.html';
        } else {
            // Affichage du message d'erreur
            errorDisplay.textContent = "Email ou mot de passe incorrect";
            errorDisplay.style.display = 'block';
            errorDisplay.style.fontSize = '1.5em';
            errorDisplay.style.textAlign = 'center';
            errorDisplay.style.marginTop = '30px';
            
            // Réinitialisation du champ mot de passe
            document.getElementById('password').value = '';
        }

    } catch (error) {
        console.error('Erreur:', error);
        errorDisplay.textContent = "Une erreur est survenue lors de la connexion";
        errorDisplay.style.display = 'block';
        errorDisplay.style.fontSize = '1.5em';
        errorDisplay.style.textAlign = 'center';
        errorDisplay.style.marginTop = '30px';
    }
}

// Initialisation du gestionnaire d'événements
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('login.html')) {
        // Vérification si l'utilisateur est déjà connecté
        const token = localStorage.getItem('token');
        if (token) {
            // Redirection vers la page d'accueil si déjà connecté
            window.location.href = './index.html';
            return;
        }

        const loginForm = document.querySelector('#login form');
        if (loginForm) {
            loginForm.addEventListener('submit', (event) => {
                event.preventDefault();
                handleLogin(event);
            });
        }
    }
});

export function updateLoginLogoutButton() {
    const loginLogoutLink = document.getElementById("loginLogout");
    const token = localStorage.getItem("token");

    if (token) {
        loginLogoutLink.textContent = "logout";
        loginLogoutLink.href = "#";
        loginLogoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            window.location.reload();
        });
    }
}

async function openModal(event) {
    event.preventDefault();
    
    // Création du modal 
    // Modal container qui permet d'avoir le fond noir transparent
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    
    // Modal content qui permet d'avoir le contenu réel du modal
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Bouton de fermeture
    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        modalContainer.remove();
    });
    
    // Titre du modal
    const modalTitle = document.createElement('h2');
    modalTitle.textContent = 'Galerie photo';
    
    // Ajout des éléments au modal
    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalTitle);
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);

    // Création d'une div pour la galerie
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'modal-gallery';
    
    // Utilisation des works du localStorage
    const works = JSON.parse(window.localStorage.getItem("works"));
    
    works.forEach(work => {
        const figure = document.createElement('figure');
        
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        
        // Création de l'icône de suppression
        const trashIcon = document.createElement('img');
        trashIcon.src = './assets/icons/trash.png';
        trashIcon.alt = 'Supprimer';
        trashIcon.className = 'trash-icon';

        deleteButton.addEventListener('click', () => {
            console.log("clic suppression");
        });
        
        deleteButton.appendChild(trashIcon);
        figure.appendChild(deleteButton);
        figure.appendChild(img);
        galleryContainer.appendChild(figure);
    });
    
    modalContent.appendChild(galleryContainer);

    const separator = document.createElement('hr');
    separator.className = 'modal-separator';
    
    modalContent.appendChild(separator);

    const addPhotoButton = document.createElement('button');
    addPhotoButton.className = 'add-photo-button';
    addPhotoButton.textContent = 'Ajouter une photo';
    addPhotoButton.addEventListener('click', () => {
    console.log("Ajout d'une photo");
});

    modalContent.appendChild(addPhotoButton);
    
    // Fermeture du modal en cliquant à l'extérieur
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            modalContainer.remove();
        }
    });
}

export function displayEditionMode() {
    const token = localStorage.getItem('token');
    
    if (token) {
        // Créer la div edition-mode
        const editionMode = document.createElement('div');
        editionMode.className = 'edition-mode';
        
        const link = document.createElement('a');
        link.href = '#';

        link.onclick = (e) => {
            e.preventDefault();
            openModal(e);
        };
        
        const img = document.createElement('img');
        img.src = './assets/icons/edit.png';
        img.alt = 'Mode édition';
        
        const text = document.createElement('p');
        text.textContent = 'Mode édition';
        
        link.appendChild(img);
        link.appendChild(text);
        editionMode.appendChild(link);
        
        // Récupérer le header et l'insérer avant celui-ci
        const header = document.querySelector('header');
        if (header) {
            header.parentNode.insertBefore(editionMode, header);
        }
    }
}

// Pour plus tard quand ajout ou suppression de work

// async function refreshWorks() {
//     const response = await fetch("http://localhost:5678/api/works");
//     const works = await response.json();
//     window.localStorage.setItem("works", JSON.stringify(works));
//     return works;
// }





