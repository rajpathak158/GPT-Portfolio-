/* =========================================================
   RAJ PATHAK PORTFOLIO
   STEP 12 — CINEMATIC MILKY WAY DEPTH
========================================================= */

import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


/* =========================================================
   DOM
========================================================= */

const canvas =
    document.getElementById("webgl");


if (!canvas) {

    console.warn(
        "WebGL canvas not found."
    );

}


/* =========================================================
   DEVICE / PERFORMANCE
========================================================= */

const isMobile =
    window.matchMedia(
        "(max-width: 700px)"
    ).matches;


const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


const particleCount =
    isMobile ? 160 : 320;


/* =========================================================
   RENDERER
========================================================= */

const renderer =
    new THREE.WebGLRenderer({

        canvas,

        alpha: true,

        antialias:
            !isMobile,

        powerPreference:
            "high-performance"

    });


renderer.setPixelRatio(

    Math.min(

        window.devicePixelRatio || 1,

        isMobile
            ? 1.2
            : 1.5

    )

);


renderer.setSize(

    window.innerWidth,

    window.innerHeight,

    false

);


/* =========================================================
   SCENE
========================================================= */

const scene =
    new THREE.Scene();


/* =========================================================
   CAMERA
========================================================= */

const camera =
    new THREE.PerspectiveCamera(

        48,

        window.innerWidth /
        window.innerHeight,

        0.1,

        100

    );


camera.position.set(

    0,

    0,

    8

);


/* =========================================================
   REAL MILKY WAY
========================================================= */

const loader =
    new THREE.TextureLoader();


const galaxyTexture =
    loader.load(

        "./assets/milky-way.jpg",

        (texture) => {

            texture.colorSpace =
                THREE.SRGBColorSpace;

            texture.anisotropy =
                Math.min(

                    renderer.capabilities
                        .getMaxAnisotropy(),

                    4

                );

            resizeGalaxy();

        }

    );


const galaxyMaterial =
    new THREE.MeshBasicMaterial({

        map:
            galaxyTexture,

        transparent:
            true,

        opacity:
            1,

        depthWrite:
            false

    });


const galaxyGeometry =
    new THREE.PlaneGeometry(

        2,

        2

    );


const galaxy =
    new THREE.Mesh(

        galaxyGeometry,

        galaxyMaterial

    );


galaxy.position.z =
    -8;


scene.add(
    galaxy
);


/* =========================================================
   ATMOSPHERIC DEPTH LAYER
========================================================= */

const atmosphereMaterial =
    new THREE.MeshBasicMaterial({

        color:
            0x34256f,

        transparent:
            true,

        opacity:
            0.085,

        depthWrite:
            false,

        blending:
            THREE.AdditiveBlending

    });


const atmosphereGeometry =
    new THREE.PlaneGeometry(

        2,

        2

    );


const atmosphere =
    new THREE.Mesh(

        atmosphereGeometry,

        atmosphereMaterial

    );


atmosphere.position.z =
    -6.5;


scene.add(
    atmosphere
);


/* =========================================================
   FOREGROUND STAR FIELD
========================================================= */

const positions =
    new Float32Array(

        particleCount * 3

    );


const sizes =
    new Float32Array(

        particleCount

    );


for (
    let i = 0;
    i < particleCount;
    i++
) {

    const i3 =
        i * 3;


    positions[i3] =
        (
            Math.random() -
            0.5
        ) * 18;


    positions[i3 + 1] =
        (
            Math.random() -
            0.5
        ) * 11;


    positions[i3 + 2] =
        (
            Math.random() -
            0.5
        ) * 6;


    sizes[i] =
        0.4 +
        Math.random() * 1.1;

}


const starGeometry =
    new THREE.BufferGeometry();


starGeometry.setAttribute(

    "position",

    new THREE.BufferAttribute(

        positions,

        3

    )

);


starGeometry.setAttribute(

    "size",

    new THREE.BufferAttribute(

        sizes,

        1

    )

);


const starMaterial =
    new THREE.PointsMaterial({

        color:
            0xffffff,

        size:
            isMobile
                ? 0.017
                : 0.022,

        transparent:
            true,

        opacity:
            0.48,

        depthWrite:
            false,

        blending:
            THREE.AdditiveBlending

    });


const stars =
    new THREE.Points(

        starGeometry,

        starMaterial

    );


stars.position.z =
    -3;


scene.add(
    stars
);


/* =========================================================
   INPUT STATE
========================================================= */

let mouseX = 0;

let mouseY = 0;

let targetX = 0;

let targetY = 0;


/*
   Device orientation
*/

let gyroX = 0;

let gyroY = 0;

let targetGyroX = 0;

let targetGyroY = 0;


/* =========================================================
   MOUSE PARALLAX
========================================================= */

if (
    !prefersReducedMotion
) {

    window.addEventListener(

        "pointermove",

        (event) => {

            targetX =
                (
                    event.clientX /
                    window.innerWidth
                ) * 2 - 1;


            targetY =
                (
                    event.clientY /
                    window.innerHeight
                ) * 2 - 1;

        },

        {
            passive: true
        }

    );

}


/* =========================================================
   TOUCH PARALLAX
========================================================= */

if (
    isMobile &&
    !prefersReducedMotion
) {

    window.addEventListener(

        "touchmove",

        (event) => {

            if (
                !event.touches ||
                !event.touches.length
            ) {
                return;
            }


            const touch =
                event.touches[0];


            targetX =
                (
                    touch.clientX /
                    window.innerWidth
                ) * 2 - 1;


            targetY =
                (
                    touch.clientY /
                    window.innerHeight
                ) * 2 - 1;

        },

        {
            passive: true
        }

    );

}


/* =========================================================
   DEVICE GYROSCOPE
========================================================= */

function handleOrientation(
    event
) {

    if (
        prefersReducedMotion
    ) {
        return;
    }


    if (
        typeof event.gamma ===
        "number"
    ) {

        targetGyroX =
            THREE.MathUtils.clamp(

                event.gamma / 30,

                -1,

                1

            );

    }


    if (
        typeof event.beta ===
        "number"
    ) {

        targetGyroY =
            THREE.MathUtils.clamp(

                (
                    event.beta - 45
                ) / 30,

                -1,

                1

            );

    }

}


function enableGyroscope() {

    if (
        typeof DeviceOrientationEvent ===
        "undefined"
    ) {

        return;

    }


    window.addEventListener(

        "deviceorientation",

        handleOrientation,

        true

    );

}


/*
   Some mobile browsers require permission.
*/

if (
    isMobile &&
    typeof DeviceOrientationEvent !==
    "undefined" &&
    typeof DeviceOrientationEvent
        .requestPermission ===
        "function"
) {

    window.addEventListener(

        "click",

        async () => {

            try {

                const permission =
                    await DeviceOrientationEvent
                        .requestPermission();


                if (
                    permission ===
                    "granted"
                ) {

                    enableGyroscope();

                }

            } catch (
                error
            ) {

                console.warn(
                    "Gyroscope permission unavailable."
                );

            }

        },

        {
            once: true
        }

    );

} else {

    enableGyroscope();

}


/* =========================================================
   GALAXY COVER CALCULATION
========================================================= */

function resizeGalaxy() {

    if (
        !galaxyTexture.image
    ) {

        return;

    }


    const width =
        window.innerWidth;


    const height =
        window.innerHeight;


    const viewportRatio =
        width / height;


    const imageWidth =
        galaxyTexture.image.width;


    const imageHeight =
        galaxyTexture.image.height;


    const imageRatio =
        imageWidth /
        imageHeight;


    let scaleX = 1;

    let scaleY = 1;


    /*
       Cover the viewport.
    */

    if (
        viewportRatio >
        imageRatio
    ) {

        scaleY =
            viewportRatio /
            imageRatio;

    } else {

        scaleX =
            imageRatio /
            viewportRatio;

    }


    /*
       Add a little extra size.

       This is important because the
       image moves with parallax and
       should never reveal its edges.
    */

    scaleX *= 1.16;

    scaleY *= 1.16;


    galaxy.scale.set(

        scaleX,

        scaleY,

        1

    );


    atmosphere.scale.set(

        scaleX,

        scaleY,

        1

    );

}


/* =========================================================
   RESIZE
========================================================= */

function resize() {

    const width =
        window.innerWidth;


    const height =
        window.innerHeight;


    camera.aspect =
        width / height;


    camera.updateProjectionMatrix();


    renderer.setSize(

        width,

        height,

        false

    );


    resizeGalaxy();

}


window.addEventListener(

    "resize",

    resize,

    {
        passive: true
    }

);


resize();


/* =========================================================
   SMOOTH MOTION
========================================================= */

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );


    const time =
        clock.getElapsedTime();


    if (
        !prefersReducedMotion
    ) {


        /* ===============================================
           SMOOTH MOUSE
        =============================================== */

        mouseX +=
            (
                targetX -
                mouseX
            ) * 0.035;


        mouseY +=
            (
                targetY -
                mouseY
            ) * 0.035;


        /* ===============================================
           SMOOTH GYROSCOPE
        =============================================== */

        gyroX +=
            (
                targetGyroX -
                gyroX
            ) * 0.025;


        gyroY +=
            (
                targetGyroY -
                gyroY
            ) * 0.025;


        /*
           Combine mouse + gyro.
        */

        const inputX =
            isMobile
                ? gyroX
                : mouseX;


        const inputY =
            isMobile
                ? gyroY
                : mouseY;


        /* ===============================================
           REAL GALAXY
           Deepest layer = smallest movement
        =============================================== */

        galaxy.position.x =
            inputX * 0.13;


        galaxy.position.y =
            -inputY * 0.09;


        galaxy.rotation.z =
            Math.sin(
                time * 0.025
            ) * 0.0015;


        /* ===============================================
           ATMOSPHERE
           Middle depth
        =============================================== */

        atmosphere.position.x =
            inputX * 0.22;


        atmosphere.position.y =
            -inputY * 0.16;


        atmosphere.rotation.z =
            Math.sin(
                time * 0.035
            ) * 0.002;


        /* ===============================================
           STARS
           Foreground = stronger movement
        =============================================== */

        stars.position.x =
            inputX * 0.42;


        stars.position.y =
            -inputY * 0.30;


        stars.rotation.y =
            time * 0.0025;


        stars.rotation.x =
            Math.sin(
                time * 0.07
            ) * 0.006;


        /* ===============================================
           CAMERA
           Extremely subtle
        =============================================== */

        camera.position.x +=
            (
                inputX * 0.075 -
                camera.position.x
            ) * 0.025;


        camera.position.y +=
            (
                -inputY * 0.055 -
                camera.position.y
            ) * 0.025;


        camera.rotation.z +=
            (
                inputX * 0.0015 -
                camera.rotation.z
            ) * 0.02;


    }


    renderer.render(

        scene,

        camera

    );

}


animate();


/* =========================================================
   TAB / VISIBILITY OPTIMIZATION
========================================================= */

document.addEventListener(

    "visibilitychange",

    () => {

        /*
           The browser automatically throttles
           requestAnimationFrame when hidden.
           We intentionally don't destroy the
           renderer because rebuilding WebGL
           contexts can be expensive on mobile.
        */

        if (
            document.hidden
        ) {

            renderer.setAnimationLoop(
                null
            );

        }

    }

);
