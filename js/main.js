/* =====================================================
   RAJ PATHAK
   STEP 4
   CINEMATIC INTRO ENGINE
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const intro =
    document.getElementById("intro");

const introVideo =
    document.getElementById("introVideo");

const enterButton =
    document.getElementById("enterButton");

const introHint =
    document.getElementById("introHint");

const loader =
    document.getElementById("loader");

const loaderProgress =
    document.getElementById("loaderProgress");

const navbar =
    document.querySelector(".navbar");

const cursorDot =
    document.querySelector(".cursor-dot");

const cursorRing =
    document.querySelector(".cursor-ring");


/* =====================================================
   INTRO STATE
===================================================== */

let experienceStarted = false;


/* =====================================================
   VIDEO PREPARATION
===================================================== */

if (introVideo) {

    introVideo.muted = true;

    introVideo.setAttribute(
        "playsinline",
        ""
    );

    introVideo.setAttribute(
        "webkit-playsinline",
        ""
    );

}


/* =====================================================
   ENTER EXPERIENCE
===================================================== */

async function startExperience() {

    if (experienceStarted) {
        return;
    }

    experienceStarted = true;


    if (enterButton) {

        enterButton.style.pointerEvents =
            "none";

        enterButton.style.opacity =
            "0.5";

    }


    if (introHint) {

        introHint.textContent =
            "ENTERING EXPERIENCE...";

    }


    /*
     * Start video.
     *
     * The click gives the browser
     * permission to start media.
     */

    if (introVideo) {

        try {

            /*
             * Start muted first.
             */

            introVideo.muted = true;

            await introVideo.play();


            /*
             * Now try to enable audio.
             *
             * Some browsers permit this because
             * the entire action came from a click.
             */

            try {

                introVideo.muted = false;

            } catch (error) {

                console.log(
                    "Audio permission handled by browser."
                );

            }


            intro.classList.add(
                "playing"
            );


            /*
             * If browser still keeps it muted,
             * update the hint.
             */

            setTimeout(() => {

                if (
                    introVideo.muted &&
                    introHint
                ) {

                    introHint.textContent =
                        "TAP TO ENABLE SOUND";

                }

            }, 700);

        }

        catch (error) {

            console.warn(
                "Video could not autoplay:",
                error
            );

            /*
             * Even if video fails,
             * continue to the portfolio.
             */

            finishIntro();

            return;

        }

    }


    /*
     * Give the intro video time to play.
     *
     * Change this value depending on
     * your introduction video length.
     */

    const INTRO_DURATION = 6500;


    setTimeout(
        finishIntro,
        INTRO_DURATION
    );

}


/* =====================================================
   FINISH INTRO
===================================================== */

function finishIntro() {

    if (!intro) {
        return;
    }


    /*
     * Start transition.
     */

    intro.classList.add(
        "exit"
    );


    /*
     * Unlock scrolling.
     */

    document.body.classList.remove(
        "intro-active"
    );


    /*
     * Stop video after transition.
     */

    setTimeout(() => {

        if (introVideo) {

            try {

                introVideo.pause();

            }

            catch (error) {}

        }

        intro.remove();

    }, 1300);

}


/* =====================================================
   BUTTON
===================================================== */

if (enterButton) {

    enterButton.addEventListener(
        "click",
        startExperience
    );

}


/* =====================================================
   OPTIONAL:
   CLICK INTRO VIDEO TO ENABLE AUDIO
===================================================== */

if (introVideo) {

    introVideo.addEventListener(
        "click",
        async () => {

            if (
                experienceStarted &&
                introVideo.muted
            ) {

                try {

                    introVideo.muted = false;

                    await introVideo.play();

                    if (introHint) {

                        introHint.textContent =
                            "SOUND ON · IMMERSIVE EXPERIENCE";

                    }

                }

                catch (error) {

                    console.log(
                        "Browser blocked audio."
                    );

                }

            }

        }
    );

}


/* =====================================================
   NAVBAR SCROLL
===================================================== */

let lastScroll =
    0;


window.addEventListener(
    "scroll",
    () => {

        const scrollY =
            window.scrollY;


        if (navbar) {

            if (scrollY > 40) {

                navbar.classList.add(
                    "scrolled"
                );

            }

            else {

                navbar.classList.remove(
                    "scrolled"
                );

            }

        }


        lastScroll =
            scrollY;

    },
    {
        passive: true
    }
);


/* =====================================================
   CUSTOM CURSOR
===================================================== */

if (
    cursorDot &&
    cursorRing &&
    window.matchMedia(
        "(pointer: fine)"
    ).matches
) {

    let mouseX = 0;
    let mouseY = 0;

    let ringX = 0;
    let ringY = 0;


    window.addEventListener(
        "mousemove",
        (event) => {

            mouseX =
                event.clientX;

            mouseY =
                event.clientY;

        },
        {
            passive: true
        }
    );


    function updateCursor() {

        cursorDot.style.left =
            `${mouseX}px`;

        cursorDot.style.top =
            `${mouseY}px`;


        ringX +=
            (
                mouseX -
                ringX
            ) * 0.13;


        ringY +=
            (
                mouseY -
                ringY
            ) * 0.13;


        cursorRing.style.left =
            `${ringX}px`;

        cursorRing.style.top =
            `${ringY}px`;


        requestAnimationFrame(
            updateCursor
        );

    }


    updateCursor();


    /*
     * Cursor interaction
     */

    const interactiveElements =
        document.querySelectorAll(
            "a, button, .project-card, .skill"
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
   MAGNETIC BUTTONS
===================================================== */

const magneticElements =
    document.querySelectorAll(
        ".magnetic"
    );


if (
    window.matchMedia(
        "(pointer: fine)"
    ).matches
) {

    magneticElements.forEach(
        (element) => {

            element.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        element.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left -
                        rect.width / 2;


                    const y =
                        event.clientY -
                        rect.top -
                        rect.height / 2;


                    element.style.transform =
                        `translate(
                            ${x * 0.12}px,
                            ${y * 0.12}px
                        )`;

                }
            );


            element.addEventListener(
                "mouseleave",
                () => {

                    element.style.transform =
                        "";

                }
            );

        }
    );

}


/* =====================================================
   SMOOTH INTERNAL LINKS
===================================================== */

document.querySelectorAll(
    'a[href^="#"]'
).forEach(
    (link) => {

        link.addEventListener(
            "click",
            (event) => {

                const targetId =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    }
);


/* =====================================================
   PAGE LOAD PROGRESS
===================================================== */

window.addEventListener(
    "load",
    () => {

        let progress =
            0;


        const interval =
            setInterval(
                () => {

                    progress +=
                        Math.random() * 12;


                    if (
                        progress >= 100
                    ) {

                        progress =
                            100;

                        clearInterval(
                            interval
                        );

                    }


                    if (loaderProgress) {

                        loaderProgress.style.width =
                            `${progress}%`;

                    }

                },
                60
            );

    }
);


/* =====================================================
   VIDEO ERROR HANDLING
===================================================== */

if (introVideo) {

    introVideo.addEventListener(
        "error",
        () => {

            console.warn(
                "intro.mp4 could not be loaded."
            );


            if (introHint) {

                introHint.textContent =
                    "WELCOME · ENTER EXPERIENCE";

            }

        }
    );

}


/* =====================================================
   VISIBILITY HANDLING
===================================================== */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden &&
            introVideo &&
            !introVideo.paused
        ) {

            introVideo.pause();

        }

    }
);
