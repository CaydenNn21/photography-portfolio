const cloudName = "ij3n4uuf";

const metadataWorker =
    "https://xc-photo-metadata.keansengphang01.workers.dev";

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

                const photoInfo = document.createElement("div");
                photoInfo.className = "photo-info";

                const photoCategory = document.createElement("span");
                photoCategory.textContent = tag.toUpperCase();

                photoInfo.appendChild(photoCategory);

                photo.appendChild(img);
                photo.appendChild(photoInfo);
                gallery.appendChild(photo);

                /* Store photo information */

                const photoIndex = allPhotos.length;

               allPhotos.push({
                    src: img.src,
                    tag: tag,
                    publicId: image.public_id,
                    format: image.format,
                    metadata: null
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


async function updateViewer() {

    const image =
        document.getElementById("viewer-image");

    const counter =
        document.getElementById("viewer-counter");

    const category =
        document.getElementById("viewer-category");

    const cameraModel =
        document.getElementById("viewer-camera-model");

    const lens =
        document.getElementById("viewer-lens");

    const focalLength =
        document.getElementById("viewer-focal-length");

    const aperture =
        document.getElementById("viewer-aperture");

    const shutter =
        document.getElementById("viewer-shutter");

    const iso =
        document.getElementById("viewer-iso");

    const photo =
        allPhotos[currentPhotoIndex];

    /*
     * Display image
     */

    image.src = photo.src;

    /*
     * Display counter
     */

    counter.textContent =
        `${String(currentPhotoIndex + 1).padStart(2, "0")} / ${String(allPhotos.length).padStart(2, "0")}`;

    /*
     * Display category
     */

    category.textContent =
        photo.tag.toUpperCase();

    /*
     * Clear old metadata
     */

    cameraModel.textContent = "";
    lens.textContent = "";

    focalLength.textContent = "";
    aperture.textContent = "";
    shutter.textContent = "";
    iso.textContent = "";

    /*
     * If metadata was already loaded,
     * use the cached version.
     */

    if (photo.metadata) {
        displayMetadata(photo.metadata);
        return;
    }

    /*
     * Get metadata from Cloudflare Worker
     */

    try {

        const response =
            await fetch(
                `${metadataWorker}/?public_id=${encodeURIComponent(photo.publicId)}`
            );

        if (!response.ok) {
            throw new Error(
                `Metadata request failed: ${response.status}`
            );
        }

        const metadata =
            await response.json();

        /*
         * Save metadata so we don't
         * request it again.
         */

        photo.metadata = metadata;

        /*
         * Display metadata
         */

        displayMetadata(metadata);

    } catch (error) {

        console.error(
            "Failed to load photo metadata:",
            error
        );

    }
}

function displayMetadata(metadata) {

    const cameraModel =
        document.getElementById("viewer-camera-model");

    const lens =
        document.getElementById("viewer-lens");

    const focalLength =
        document.getElementById("viewer-focal-length");

    const aperture =
        document.getElementById("viewer-aperture");

    const shutter =
        document.getElementById("viewer-shutter");

    const iso =
        document.getElementById("viewer-iso");


    /*
     * Camera
     */

    if (metadata.make && metadata.model) {

        cameraModel.textContent =
            `${metadata.make} ${metadata.model}`;

    } else if (metadata.model) {

        cameraModel.textContent =
            metadata.model;

    }


    /*
     * Lens
     */

    if (metadata.lens) {

        lens.textContent =
            metadata.lens;

    }


    /*
     * Camera settings
     */

    if (metadata.focalLength) {

        focalLength.textContent =
            metadata.focalLength;

    }

    if (metadata.aperture) {

        aperture.textContent =
            `f/${metadata.aperture}`;

    }

    if (metadata.shutterSpeed) {

        shutter.textContent =
            metadata.shutterSpeed;

    }

    if (metadata.iso) {

        iso.textContent =
            `ISO ${metadata.iso}`;

    }
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


document
    .querySelector(".footer-bottom span:last-child")
    .addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });
/* =========================
   LOAD PHOTOS
========================= */

loadGallery("travel", "travel-gallery");
loadGallery("street", "street-gallery");
loadGallery("architecture", "architecture-gallery");