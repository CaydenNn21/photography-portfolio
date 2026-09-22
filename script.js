const cloudName = "ij3n4uuf";

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

            });

        })
        .catch(error => {
            console.error(`Failed to load ${tag} gallery:`, error);
        });
}


loadGallery("street", "street-gallery");