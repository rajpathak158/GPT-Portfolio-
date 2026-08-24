/* =========================================================
   RAJ PATHAK PORTFOLIO
   STEP 5.3 — 3D GALAXY ENGINE
========================================================= */

import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


/* =========================================================
   BASIC SETUP
========================================================= */

const canvas = document.getElementById("webgl");

if (!canvas) {
    console.warn("WebGL canvas not found.");
} else {

    const isMobile =
        window.matchMedia("(max-width: 700px)").matches;


    /* =====================================================
       SCENE
    ===================================================== */

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x02010a);

    scene.fog = new THREE.FogExp2(
        0x02010a,
        isMobile ? 0.018 : 0.012
    );


    /* =====================================================
       CAMERA
    ===================================================== */

    const camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.1,
        250
    );

    camera.position.set(
        0,
        0,
        18
    );


    /* =====================================================
       RENDERER
    ===================================================== */

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: !isMobile,
        alpha: true,
        powerPreference: "high-performance"
    });

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            isMobile ? 1.35 : 1.8
        )
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.outputColorSpace =
        THREE.SRGBColorSpace;


    /* =====================================================
       GALAXY GROUP
    ===================================================== */

    const galaxy = new THREE.Group();

    scene.add(galaxy);


    /* =====================================================
       STAR FIELD
    ===================================================== */

    const starCount =
        isMobile ? 2800 : 5200;

    const starPositions =
        new Float32Array(starCount * 3);

    const starColors =
        new Float32Array(starCount * 3);


    const colorA =
        new THREE.Color("#8b5cff");

    const colorB =
        new THREE.Color("#00cfff");

    const colorC =
        new THREE.Color("#ff4fd8");

    const colorD =
        new THREE.Color("#ffffff");


    for (let i = 0; i < starCount; i++) {

        const radius =
            8 +
            Math.pow(Math.random(), 0.55) * 70;

        const theta =
            Math.random() *
            Math.PI *
            2;

        const spread =
            (Math.random() - 0.5) *
            42;

        const x =
            Math.cos(theta) *
            radius;

        const y =
            spread *
            (0.35 + radius / 100);

        const z =
            Math.sin(theta) *
            radius;


        const index =
            i * 3;


        starPositions[index] =
            x;

        starPositions[index + 1] =
            y;

        starPositions[index + 2] =
            z;


        const randomColor =
            Math.random();


        let color;


        if (randomColor < 0.25) {
            color = colorA;
        }

        else if (randomColor < 0.5) {
            color = colorB;
        }

        else if (randomColor < 0.7) {
            color = colorC;
        }

        else {
            color = colorD;
        }


        starColors[index] =
            color.r;

        starColors[index + 1] =
            color.g;

        starColors[index + 2] =
            color.b;
    }


    const starGeometry =
        new THREE.BufferGeometry();


    starGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            starPositions,
            3
        )
    );


    starGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(
            starColors,
            3
        )
    );


    const starMaterial =
        new THREE.PointsMaterial({

            size:
                isMobile
                    ? 0.055
                    : 0.075,

            vertexColors: true,

            transparent: true,

            opacity: 0.82,

            depthWrite: false,

            blending:
                THREE.AdditiveBlending
        });


    const stars =
        new THREE.Points(
            starGeometry,
            starMaterial
        );


    galaxy.add(stars);


    /* =====================================================
       NEBULA CLOUD
    ===================================================== */

    const nebulaGeometry =
        new THREE.BufferGeometry();


    const nebulaCount =
        isMobile ? 550 : 950;


    const nebulaPositions =
        new Float32Array(
            nebulaCount * 3
        );


    const nebulaColors =
        new Float32Array(
            nebulaCount * 3
        );


    for (
        let i = 0;
        i < nebulaCount;
        i++
    ) {

        const radius =
            7 +
            Math.random() * 30;

        const angle =
            Math.random() *
            Math.PI *
            2;

        const x =
            Math.cos(angle) *
            radius;

        const z =
            Math.sin(angle) *
            radius;

        const y =
            (Math.random() - 0.5) *
            7;


        const index =
            i * 3;


        nebulaPositions[index] =
            x;

        nebulaPositions[index + 1] =
            y;

        nebulaPositions[index + 2] =
            z;


        const c =
            Math.random();


        if (c < 0.33) {

            nebulaColors[index] =
                0.32;

            nebulaColors[index + 1] =
                0.12;

            nebulaColors[index + 2] =
                0.9;

        }

        else if (c < 0.66) {

            nebulaColors[index] =
                0.0;

            nebulaColors[index + 1] =
                0.55;

            nebulaColors[index + 2] =
                1.0;

        }

        else {

            nebulaColors[index] =
                0.95;

            nebulaColors[index + 1] =
                0.08;

            nebulaColors[index + 2] =
                0.65;
        }
    }


    nebulaGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            nebulaPositions,
            3
        )
    );


    nebulaGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(
            nebulaColors,
            3
        )
    );


    const nebulaMaterial =
        new THREE.PointsMaterial({

            size:
                isMobile
                    ? 0.11
                    : 0.16,

            vertexColors: true,

            transparent: true,

            opacity: 0.18,

            depthWrite: false,

            blending:
                THREE.AdditiveBlending
        });


    const nebula =
        new THREE.Points(
            nebulaGeometry,
            nebulaMaterial
        );


    galaxy.add(nebula);


    /* =====================================================
       CENTRAL COSMIC CORE
    ===================================================== */

    const coreGroup =
        new THREE.Group();

    galaxy.add(coreGroup);


    /* =====================================================
       CORE
    ===================================================== */

    const coreGeometry =
        new THREE.SphereGeometry(
            1.35,
            isMobile ? 24 : 40,
            isMobile ? 24 : 40
        );


    const coreMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x030208
        });


    const core =
        new THREE.Mesh(
            coreGeometry,
            coreMaterial
        );


    coreGroup.add(core);


    /* =====================================================
       PURPLE INNER GLOW
    ===================================================== */

    const glowGeometry =
        new THREE.SphereGeometry(
            1.55,
            24,
            24
        );


    const glowMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x714cff,

            transparent: true,

            opacity: 0.10,

            blending:
                THREE.AdditiveBlending
        });


    const glow =
        new THREE.Mesh(
            glowGeometry,
            glowMaterial
        );


    coreGroup.add(glow);


    /* =====================================================
       ORBIT RINGS
    ===================================================== */

    function createOrbit(
        radius,
        tube,
        color,
        rotation
    ) {

        const geometry =
            new THREE.TorusGeometry(
                radius,
                tube,
                8,
                isMobile ? 80 : 120
            );


        const material =
            new THREE.MeshBasicMaterial({

                color,

                transparent: true,

                opacity: 0.55,

                blending:
                    THREE.AdditiveBlending
            });


        const mesh =
            new THREE.Mesh(
                geometry,
                material
            );


        mesh.rotation.set(
            rotation.x,
            rotation.y,
            rotation.z
        );


        coreGroup.add(mesh);


        return mesh;
    }


    const orbitOne =
        createOrbit(
            2.2,
            0.035,
            0x7d4cff,
            {
                x: 1.15,
                y: 0.15,
                z: 0.2
            }
        );


    const orbitTwo =
        createOrbit(
            2.65,
            0.025,
            0x00d5ff,
            {
                x: 1.0,
                y: -0.5,
                z: -0.2
            }
        );


    const orbitThree =
        createOrbit(
            3.1,
            0.018,
            0xff4fd8,
            {
                x: 1.3,
                y: 0.8,
                z: 0.3
            }
        );


    /* =====================================================
       SMALL ORBITING PARTICLES
    ===================================================== */

    const particleCount =
        isMobile ? 45 : 75;


    const particleGeometry =
        new THREE.SphereGeometry(
            0.035,
            6,
            6
        );


    const particleMaterials = [

        new THREE.MeshBasicMaterial({
            color: 0x7c55ff
        }),

        new THREE.MeshBasicMaterial({
            color: 0x00d9ff
        }),

        new THREE.MeshBasicMaterial({
            color: 0xff55d8
        })
    ];


    const orbitParticles = [];


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const particle =
            new THREE.Mesh(
                particleGeometry,
                particleMaterials[
                    i % 3
                ]
            );


        const radius =
            3 +
            Math.random() * 4;


        const angle =
            Math.random() *
            Math.PI *
            2;


        particle.userData = {

            radius,

            angle,

            speed:
                0.15 +
                Math.random() *
                0.35,

            height:
                (Math.random() - 0.5) *
                1.4
        };


        coreGroup.add(particle);

        orbitParticles.push(
            particle
        );
    }


    /* =====================================================
       DISTANT GALAXY SPIRAL
    ===================================================== */

    const spiralCount =
        isMobile ? 900 : 1600;


    const spiralPositions =
        new Float32Array(
            spiralCount * 3
        );


    const spiralColors =
        new Float32Array(
            spiralCount * 3
        );


    for (
        let i = 0;
        i < spiralCount;
        i++
    ) {

        const progress =
            i / spiralCount;

        const radius =
            3.5 +
            progress * 17;

        const arm =
            i % 3;

        const angle =
            progress * Math.PI * 8 +
            arm * (
                Math.PI * 2 / 3
            );

        const randomness =
            (Math.random() - 0.5) *
            (1.0 + progress * 3);


        const index =
            i * 3;


        spiralPositions[index] =
            Math.cos(angle) *
            radius +
            randomness;


        spiralPositions[index + 1] =
            (Math.random() - 0.5) *
            (1.5 + progress * 3);


        spiralPositions[index + 2] =
            Math.sin(angle) *
            radius +
            randomness;


        const color =
            new THREE.Color();


        if (arm === 0) {

            color.setHex(
                0x754dff
            );

        }

        else if (arm === 1) {

            color.setHex(
                0x00cfff
            );

        }

        else {

            color.setHex(
                0xff4fd8
            );
        }


        spiralColors[index] =
            color.r;

        spiralColors[index + 1] =
            color.g;

        spiralColors[index + 2] =
            color.b;
    }


    const spiralGeometry =
        new THREE.BufferGeometry();


    spiralGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            spiralPositions,
            3
        )
    );


    spiralGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(
            spiralColors,
            3
        )
    );


    const spiralMaterial =
        new THREE.PointsMaterial({

            size:
                isMobile
                    ? 0.07
                    : 0.095,

            vertexColors: true,

            transparent: true,

            opacity: 0.45,

            depthWrite: false,

            blending:
                THREE.AdditiveBlending
        });


    const spiral =
        new THREE.Points(
            spiralGeometry,
            spiralMaterial
        );


    galaxy.add(spiral);


    /* =====================================================
       MOUSE / TOUCH PARALLAX
    ===================================================== */

    let targetMouseX = 0;
    let targetMouseY = 0;

    let currentMouseX = 0;
    let currentMouseY = 0;


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


    /* =====================================================
       ANIMATION
    ===================================================== */

    const clock =
        new THREE.Clock();


    function animate() {

        requestAnimationFrame(
            animate
        );


        const elapsed =
            clock.getElapsedTime();


        /* ---------------------------------------------
           SMOOTH MOUSE
        --------------------------------------------- */

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


        /* ---------------------------------------------
           GALAXY ROTATION
        --------------------------------------------- */

        stars.rotation.y =
            elapsed * 0.006;


        stars.rotation.x =
            Math.sin(
                elapsed * 0.08
            ) * 0.015;


        nebula.rotation.y =
            -elapsed * 0.008;


        spiral.rotation.y =
            elapsed * 0.018;


        spiral.rotation.x =
            Math.sin(
                elapsed * 0.12
            ) * 0.025;


        /* ---------------------------------------------
           CORE FLOAT
        --------------------------------------------- */

        coreGroup.position.y =
            Math.sin(
                elapsed * 0.45
            ) * 0.12;


        coreGroup.rotation.y =
            elapsed * 0.12;


        core.rotation.y =
            elapsed * 0.2;


        glow.scale.setScalar(
            1 +
            Math.sin(
                elapsed * 1.5
            ) * 0.04
        );


        /* ---------------------------------------------
           ORBITS
        --------------------------------------------- */

        orbitOne.rotation.z =
            elapsed * 0.55;


        orbitTwo.rotation.z =
            -elapsed * 0.42;


        orbitThree.rotation.z =
            elapsed * 0.28;


        /* ---------------------------------------------
           ORBIT PARTICLES
        --------------------------------------------- */

        orbitParticles.forEach(
            (particle) => {

                const data =
                    particle.userData;


                data.angle +=
                    data.speed *
                    0.01;


                particle.position.x =
                    Math.cos(
                        data.angle
                    ) *
                    data.radius;


                particle.position.z =
                    Math.sin(
                        data.angle
                    ) *
                    data.radius;


                particle.position.y =
                    data.height +
                    Math.sin(
                        elapsed +
                        data.angle
                    ) *
                    0.12;
            }
        );


        /* ---------------------------------------------
           PARALLAX
        --------------------------------------------- */

        galaxy.rotation.y +=
            (
                currentMouseX * 0.035 -
                galaxy.rotation.y
            ) * 0.008;


        galaxy.rotation.x +=
            (
                currentMouseY * 0.025 -
                galaxy.rotation.x
            ) * 0.008;


        camera.position.x +=
            (
                currentMouseX * 0.8 -
                camera.position.x
            ) * 0.025;


        camera.position.y +=
            (
                -currentMouseY * 0.5 -
                camera.position.y
            ) * 0.025;


        camera.lookAt(
            0,
            0,
            0
        );


        /* ---------------------------------------------
           RENDER
        --------------------------------------------- */

        renderer.render(
            scene,
            camera
        );
    }


    animate();


    /* =====================================================
       RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            camera.aspect =
                window.innerWidth /
                window.innerHeight;


            camera.updateProjectionMatrix();


            renderer.setPixelRatio(
                Math.min(
                    window.devicePixelRatio,
                    window.innerWidth < 700
                        ? 1.35
                        : 1.8
                )
            );


            renderer.setSize(
                window.innerWidth,
                window.innerHeight
            );
        }
    );


    /* =====================================================
       CLEANUP WHEN PAGE IS HIDDEN
       Helps reduce mobile CPU usage.
    ===================================================== */

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
           }
