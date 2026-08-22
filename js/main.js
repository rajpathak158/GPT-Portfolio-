/* =====================================================
   RAJ PATHAK — PORTFOLIO
   MAIN JAVASCRIPT
===================================================== */


/* =====================================================
   PAGE LOADER
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        document.body.classList.add(
            "loading"
        );


        const loader =
            document.getElementById(
                "loader"
            );

        const progressBar =
            document.querySelector(
                ".loader-progress-bar"
            );

        const percent =
            document.getElementById(
                "loader-percent"
            );


        let progress = 0;


        const loading =
            setInterval(
                () => {

                    progress +=
                        Math.random() * 7;


                    if (
                        progress >= 100
                    ) {

                        progress = 100;

                        clearInterval(
                            loading
                        );


                        setTimeout(
                            () => {

                                loader.classList.add(
                                    "hidden"
                                );

                                document.body.classList.remove(
                                    "loading"
                                );

                            },
                            450
                        );

                    }


                    progressBar.style.width =
                        `${progress}%`;


                    percent.textContent =
                        `${Math.floor(progress)
                            .toString()
                            .padStart(3, "0")}%`;

                },
                70
            );

    }
);


/* =====================================================
   NAVBAR
===================================================== */

const navbar =
    document.querySelector(
        ".navbar"
    );


function updateNavbar() {

    if (
        window.scrollY > 60
    ) {

        navbar.classList.add(
            "scrolled"
        );

    } else {

        navbar.classList.remove(
            "scrolled"
        );

    }

}


window.addEventListener(
    "scroll",
    updateNavbar,
    {
        passive: true
    }
);


updateNavbar();


/* =====================================================
   CUSTOM CURSOR
===================================================== */

const cursorDot =
    document.querySelector(
        ".cursor-dot"
    );

const cursorRing =
    document.querySelector(
        ".cursor-ring"
    );


const desktopPointer =
    window.matchMedia(
        "(pointer:fine)"
    );


if (
    desktopPointer.matches
) {

    let mouseX =
        window.innerWidth / 2;

    let mouseY =
        window.innerHeight / 2;


    let ringX = mouseX;

    let ringY = mouseY;


    window.addEventListener(
        "mousemove",
        (event) => {

            mouseX =
                event.clientX;

            mouseY =
                event.clientY;


            cursorDot.style.left =
                `${mouseX}px`;

            cursorDot.style.top =
                `${mouseY}px`;

        }
    );


    function cursorAnimation() {

        ringX +=
            (
                mouseX -
                ringX
            ) * 0.12;


        ringY +=
            (
                mouseY -
                ringY
            ) * 0.12;


        cursorRing.style.left =
            `${ringX}px`;

        cursorRing.style.top =
            `${ringY}px`;


        requestAnimationFrame(
            cursorAnimation
        );

    }


    cursorAnimation();


    const interactiveElements =
        document.querySelectorAll(
            "a, .project-card, .skill"
        );


    interactiveElements.forEach(
        (element) => {

            element.addEventListener(
                "mouseenter",
                () => {

                    cursorRing.classList.add(
                        "active"
                    );

                }
            );


            element.addEventListener(
                "mouseleave",
                () => {

                    cursorRing.classList.remove(
                        "active"
                    );

                }
            );

        }
    );

}


/* =====================================================
   PROJECT 3D TILT
===================================================== */

const projectCards =
    document.querySelectorAll(
        ".project-card"
    );


if (
    desktopPointer.matches
) {

    projectCards.forEach(
        (card) => {

            const visual =
                card.querySelector(
                    ".project-visual"
                );


            card.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        card.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left;


                    const y =
                        event.clientY -
                        rect.top;


                    const rotateY =
                        (
                            x /
                            rect.width -
                            0.5
                        ) * 5;


                    const rotateX =
                        (
                            y /
                            rect.height -
                            0.5
                        ) * -5;


                    visual.style.transform =
                        `
                        perspective(1000px)
                        rotateX(${rotateX}deg)
                        rotateY(${rotateY}deg)
                        translateY(-6px)
                        scale(1.015)
                        `;

                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    visual.style.transform =
                        "";

                }
            );

        }
    );

}


/* =====================================================
   SMOOTH ANCHOR NAVIGATION
===================================================== */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const targetID =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        targetID === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            targetID
                        );


                    if (
                        !target
                    ) {

                        return;

                    }


                    event.preventDefault();


                    target.scrollIntoView(
                        {
                            behavior:
                                "smooth"
                        }
                    );

                }
            );

        }
    );


/* =====================================================
   MOBILE VIEWPORT FIX
===================================================== */

function updateViewportHeight() {

    document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
    );

}


updateViewportHeight();


window.addEventListener(
    "resize",
    updateViewportHeight
);
