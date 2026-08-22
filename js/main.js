/* =========================================
   PORTFOLIO — MAIN JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       LOADER
    ====================================== */

    const loader = document.getElementById("loader");
    const loaderLine = document.querySelector(".loader-line span");
    const loaderPercent = document.querySelector(".loader-percent");

    let progress = 0;

    const loading = setInterval(() => {

        progress += Math.random() * 8;

        if (progress >= 100) {

            progress = 100;

            clearInterval(loading);

            setTimeout(() => {

                loader.classList.add("hidden");

            }, 500);
        }

        loaderLine.style.width = `${progress}%`;

        loaderPercent.textContent =
            `${Math.floor(progress).toString().padStart(3, "0")}%`;

    }, 70);


    /* =====================================
       CUSTOM CURSOR
    ====================================== */

    const cursor = document.querySelector(".cursor");
    const follower = document.querySelector(".cursor-follower");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let followerX = mouseX;
    let followerY = mouseY;

    if (window.matchMedia("(pointer:fine)").matches) {

        window.addEventListener("mousemove", (event) => {

            mouseX = event.clientX;
            mouseY = event.clientY;

            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;

        });

        function animateCursor() {

            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;

            follower.style.left = `${followerX}px`;
            follower.style.top = `${followerY}px`;

            requestAnimationFrame(animateCursor);
        }

        animateCursor();


        document
            .querySelectorAll("a, .project, .skills-grid div")
            .forEach(element => {

                element.addEventListener("mouseenter", () => {

                    follower.style.width = "55px";
                    follower.style.height = "55px";

                });

                element.addEventListener("mouseleave", () => {

                    follower.style.width = "34px";
                    follower.style.height = "34px";

                });

            });

    }


    /* =====================================
       NAVIGATION BACKGROUND
    ====================================== */

    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 60) {

            navbar.style.background =
                "rgba(5,5,5,0.65)";

            navbar.style.backdropFilter =
                "blur(18px)";

            navbar.style.padding =
                "18px 5vw";

        } else {

            navbar.style.background =
                "transparent";

            navbar.style.backdropFilter =
                "none";

            navbar.style.padding =
                "28px 5vw";

        }

    });


    /* =====================================
       PROJECT TILT
    ====================================== */

    const projects =
        document.querySelectorAll(".project");

    projects.forEach(project => {

        project.addEventListener("mousemove", (event) => {

            const rect =
                project.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            const rotateY =
                ((x / rect.width) - 0.5) * 5;

            const rotateX =
                ((y / rect.height) - 0.5) * -5;

            const image =
                project.querySelector(".project-image");

            image.style.transform =
                `perspective(900px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 scale(1.02)`;

        });

        project.addEventListener("mouseleave", () => {

            const image =
                project.querySelector(".project-image");

            image.style.transform =
                "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";

        });

    });

});
