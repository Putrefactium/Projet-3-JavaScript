export function sendContactForm() { 
    document.querySelector('#contact form').addEventListener('submit', e => {
        e.preventDefault(); // Empêcher l'envoi du formulaire d'abord
        
        // Créer un élément div pour notre message toast
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = 'Cette fonction n\'est pas encore implémentée';
        
        // Ajouter le style pour le toast
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #ff4444;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            z-index: 1000;
        `;
        
        // Ajouter le toast au document
        document.body.appendChild(toast);
        
        // Supprimer le toast après 3 secondes
        setTimeout(() => {
            toast.remove();
        }, 3000);
    });
}