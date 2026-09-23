const cloudName = "ij3n4uuf";

let allPhotos = [];
let currentPhotoIndex = 0;


/* =========================
   LOAD GALLERY
========================= */

function loadGallery(tag, galleryId) {
    const gallery = document.getElementById(galleryId);

    const url =
        `https://res.cloudinary.com/${cloudName}/image/list/${tag}.json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {

            data.resources.forEach(image => {

                const photo = document.createElement("div");
                photo.className = "photo";

                const img = document.createElement("img");

                img.src =
                    `https://res.cloudinary.com/${cloudName}/image/upload/${image.public_id}.${image.format}`;

                img.alt = "XC Photography";

                photo.appendChild(img);
                gallery.appendChild(photo);


                /* Store photo information */

                const photoIndex = allPhotos.length;

                allPhotos.push({
                    src: img.src,
                    tag: tag
                });


                /* Open fullscreen viewer */

                photo.addEventListener("click", () => {
                    openViewer(photoIndex);
                });

            });

        })
        .catch(error => {
            console.error(`Failed to load ${tag} gallery:`, error);
        });
}


/* =========================
   PHOTO VIEWER
========================= */

function openViewer(index) {

    currentPhotoIndex = index;

    const viewer = document.getElementById("photo-viewer");

    viewer.classList.add("active");

    updateViewer();

    document.body.style.overflow = "hidden";
}


function closeViewer() {

    const viewer = document.getElementById("photo-viewer");

    viewer.classList.remove("active");

    document.body.style.overflow = "";
}


function updateViewer() {

    const image = document.getElementById("viewer-image");
    const counter = document.getElementById("viewer-counter");
    const category = document.getElementById("viewer-category");

    const photo = allPhotos[currentPhotoIndex];

    image.src = photo.src;

    counter.textContent =
        `${String(currentPhotoIndex + 1).padStart(2, "0")} / ${String(allPhotos.length).padStart(2, "0")}`;

    category.textContent =
        photo.tag.toUpperCase();
}


/* =========================
   NEXT / PREVIOUS
========================= */

function nextPhoto() {

    currentPhotoIndex++;

    if (currentPhotoIndex >= allPhotos.length) {
        currentPhotoIndex = 0;
    }

    updateViewer();
}


function previousPhoto() {

    currentPhotoIndex--;

    if (currentPhotoIndex < 0) {
        currentPhotoIndex = allPhotos.length - 1;
    }

    updateViewer();
}


/* =========================
   KEYBOARD CONTROLS
========================= */

document.addEventListener("keydown", event => {

    const viewer =
        document.getElementById("photo-viewer");

    if (!viewer.classList.contains("active")) {
        return;
    }

    if (event.key === "Escape") {
        closeViewer();
    }

    if (event.key === "ArrowRight") {
        nextPhoto();
    }

    if (event.key === "ArrowLeft") {
        previousPhoto();
    }

});

document
    .getElementById("viewer-close")
    .addEventListener("click", closeViewer);


document
    .getElementById("viewer-next")
    .addEventListener("click", nextPhoto);


document
    .getElementById("viewer-prev")
    .addEventListener("click", previousPhoto);
    
/* =========================
   LOAD PHOTOS
========================= */

loadGallery("travel", "travel-gallery");
loadGallery("street", "street-gallery");
loadGallery("architecture", "architecture-gallery");