import {generateWorks} from "./works.js";
import { initializeFilterButtons } from './buttons.js';
import { handleLogin, updateLoginLogoutButton } from './login.js';

let works = window.localStorage.getItem("works");

if (!works){
    const answer = await fetch("http://localhost:5678/api/works");
    works = await answer.json();

    const valueWorks = JSON.stringify(works);
    window.localStorage.setItem("works", valueWorks);
} else {
    works = JSON.parse(works);
}

generateWorks(works);
initializeFilterButtons();
handleLogin();

document.addEventListener("DOMContentLoaded", updateLoginLogoutButton);




