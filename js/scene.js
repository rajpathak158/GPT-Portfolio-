/* =========================================================
   RAJ PATHAK PORTFOLIO
   STEP 11 — REAL MILKY WAY 3D HERO
========================================================= */

import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


/* =========================================================
   SETUP
========================================================= */

const canvas = document.getElementById("webgl");

if (!canvas) {
    console.warn("WebGL canvas not found.");
}


/* =========================================================
   DEVICE PERFORMANCE
========================================================= */

const isMobile =
    window.matchMedia("(max-width: 700px)").matches;

const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


const renderer = new THREE.WebGLRenderer({

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
        isMobile ? 1.25 : 1.75
    )

);


/* =========================================================
   SCENE
========================================================= */

const scene = new THREE.Scene();


/* =========================================================
   CAMERA
========================================================= */

const camera = new THREE.PerspectiveCamera(

    45,

    window.innerWidth /
        window.innerHeight,

    0.1,

    100

);

camera.position.z = 8;


/* =========================================================
   REAL MILKY WAY BACKGROUND
========================================================= */

const backgroundTextureLoader =
    new THREE.TextureLoader();


const backgroundTexture =
    backgroundTextureLoader.load(

        "./assets/milky-way.jpg",

        () => {

            backgroundTexture.colorSpace =
                THREE.SRGBColorSpace;

        }

    );


const backgroundMaterial =
    new THREE.MeshBasicMaterial({

        map:
            backgroundTexture,

        transparent:
            true,

        opacity:
            0.95

    });


const backgroundGeometry =
    new THREE.PlaneGeometry(

        2,

        2

    );


const backgroundPlane =
    new THREE.Mesh(

        backgroundGeometry,

        backgroundMaterial

    );


backgroundPlane.position.z =
    -8;


scene.add(
    backgroundPlane
);


/* =========================================================
   DEPTH OVERLAY
========================================================= */

const depthMaterial =
    new THREE.MeshBasicMaterial({

        color:
            0x05030f,

        transparent:
            true,

        opacity:
            0.16

    });


const depthGeometry =
    new THREE.PlaneGeometry(

        2,

        2

    );


const depthPlane =
    new THREE.Mesh(

        depthGeometry,

        depthMaterial

    );


depthPlane.position.z =
    -7.8;


scene.add(
    depthPlane
);


/* =========================================================
   STAR PARTICLES
   Lightweight — NOT thousands of particles
========================================================= */

const particleCount =
    isMobile ? 220 : 420;


const particlePositions =
    new Float32Array(
        particleCount * 3
    );


const particleSizes =
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


    particlePositions[i3] =
        (Math.random() - 0.5) * 18;


    particlePositions[i3 + 1] =
        (Math.random() - 0.5) * 10;


    particlePositions[i3 + 2] =
        (Math.random() - 0.5) * 8;


    particleSizes[i] =
        0.5 +
        Math.random() * 1.2;

}


const particleGeometry =
    new THREE.BufferGeometry();


particleGeometry.setAttribute(

    "position",

    new THREE.BufferAttribute(

        particlePositions,

        3

    )

);


particleGeometry.setAttribute(

    "size",

    new THREE.BufferAttribute(

        particleSizes,

        1

    )

);


const particleMaterial =
    new THREE.PointsMaterial({

        color:
            0xffffff,

        size:
            isMobile
                ? 0.018
                : 0.024,

        transparent:
            true,

        opacity:
            0.55,

        depthWrite:
            false,

        blending:
            THREE.AdditiveBlending

    });


const stars =
    new THREE.Points(

        particleGeometry,

        particleMaterial

    );


stars.position.z =
    -4;


scene.add(
    stars
);


/* =========================================================
   PARALLAX
========================================================= */

let targetMouseX = 0;

let targetMouseY = 0;

let currentMouseX = 0;

let currentMouseY = 0;


if (
    !isMobile &&
    !prefersReducedMotion
) {

    window.addEventListener(

        "pointermove",

        (event) => {

            targetMouseX =
                (event.clientX /
                    window.innerWidth -
                    0.5);

            targetMouseY =
                (event.clientY /
                    window.innerHeight -
                    0.5);

        },

        {
            passive: true
        }

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


    /*
       Keep the image covering the viewport.
    */

    const aspect =
        width / height;


    if (
        backgroundTexture.image
    ) {

        const imageWidth =
            backgroundTexture.image.width;

        const imageHeight =
            backgroundTexture.image.height;

        const imageAspect =
            imageWidth /
            imageHeight;


        let scaleX = 1;

        let scaleY = 1;


        if (
            aspect > imageAspect
        ) {

            scaleY =
                aspect /
                imageAspect;

        } else {

            scaleX =
                imageAspect /
                aspect;

        }


        backgroundPlane.scale.set(
            scaleX,
            scaleY,
            1
        );


        depthPlane.scale.set(
            scaleX,
            scaleY,
            1
        );

    }

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
   ANIMATION
========================================================= */

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );


    const elapsed =
        clock.getElapsedTime();


    if (
        !prefersReducedMotion
    ) {

        /*
           Smooth mouse interpolation
        */

        currentMouseX +=
            (
                targetMouseX -
                currentMouseX
            ) * 0.035;


        currentMouseY +=
            (
                targetMouseY -
                currentMouseY
            ) * 0.035;


        /*
           Real galaxy movement
        */

        backgroundPlane.position.x =
            currentMouseX * 0.12;


        backgroundPlane.position.y =
            currentMouseY * 0.08;


        /*
           Slight cinematic drift
        */

        backgroundPlane.rotation.z =
            Math.sin(
                elapsed * 0.035
            ) * 0.0015;


        /*
           Depth layer moves differently
        */

        depthPlane.position.x =
            currentMouseX * 0.20;


        depthPlane.position.y =
            currentMouseY * 0.14;


        /*
           Stars move slightly faster
        */

        stars.rotation.y =
            elapsed * 0.004;


        stars.rotation.x =
            Math.sin(
                elapsed * 0.08
            ) * 0.008;

    }


    renderer.render(
        scene,
        camera
    );

}


animate();


/* =========================================================
   VISIBILITY OPTIMIZATION
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden
        ) {

            renderer.setAnimationLoop(
                null
            );

        } else {

            renderer.setAnimationLoop(
                animate
            );

        }

    }
);
