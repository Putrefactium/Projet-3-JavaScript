export function generateWorks(works){
    for (let i = 0; i < works.length; i++) {
        const work = works[i];
        const sectionWorks = document.querySelector(".gallery");
        const sectionFigure = document.createElement("figure");
        const sectionImage = document.createElement("img");
        sectionImage.src = work.imageUrl;
        const sectionFigcaption = document.createElement("figcaption");
        sectionFigcaption.textContent = work.title;

        sectionFigure.appendChild(sectionImage);
        sectionFigure.appendChild(sectionFigcaption);
        sectionWorks.appendChild(sectionFigure);
    }
}

