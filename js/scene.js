/* =========================================================
   RAJ PATHAK — IMMERSIVE 3D PORTFOLIO
   STEP 3
   OPTIMIZED GALAXY + 3D ENVIRONMENT

   Designed for:
   Desktop
   Laptop
   Android
   GitHub Pages

   No external models.
   No large textures.
   GPU-friendly particles.
========================================================= */

import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


/* =========================================================
   CANVAS
========================================================= */

const canvas = document.getElementById("webgl");

if (!canvas) {
    throw new Error("WebGL canvas #webgl was not found.");
}


/* =========================================================
   DEVICE PERFORMANCE PROFILE
========================================================= */

const mobile =
    window.innerWidth <= 800;

const lowPower =
    mobile ||
    navigator.hardwareConcurrency <= 4;

const pixelRatio =
    Math.min(
        window.devicePixelRatio || 1,
        mobile ? 1.25 : 1.5
    );


/*
    IMPORTANT:

    We deliberately cap pixel ratio.

    A phone with DPR 3 can otherwise make WebGL
    render roughly 9x as many pixels.
*/


/* =========================================================
   SCENE
========================================================= */

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x02010a);


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
    0.8,
    9
);


/* =========================================================
   RENDERER
========================================================= */

const renderer =
    new THREE.WebGLRenderer({

        canvas,

        antialias:
            !lowPower,

        alpha: true,

        powerPreference:
            "high-performance"

    });


renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    pixelRatio
);

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure =
    1.15;


/* =========================================================
   FOG
========================================================= */

scene.fog =
    new THREE.FogExp2(
        0x050214,
        mobile
            ? 0.035
            : 0.025
    );


/* =========================================================
   LIGHTING
========================================================= */

const ambient =
    new THREE.AmbientLight(
        0x6875ff,
        0.22
    );

scene.add(ambient);


/* Blue light */

const blueLight =
    new THREE.PointLight(
        0x3b6dff,
        mobile ? 5 : 10,
        20
    );

blueLight.position.set(
    -5,
    2,
    4
);

scene.add(blueLight);


/* Purple light */

const purpleLight =
    new THREE.PointLight(
        0xa53cff,
        mobile ? 4 : 8,
        18
    );

purpleLight.position.set(
    5,
    -1,
    2
);

scene.add(purpleLight);


/* Warm light */

const goldLight =
    new THREE.PointLight(
        0xff9a42,
        mobile ? 2 : 5,
        15
    );

goldLight.position.set(
    0,
    3,
    4
);

scene.add(goldLight);


/* =========================================================
   WORLD
========================================================= */

const world =
    new THREE.Group();

scene.add(world);


/* =========================================================
   GALAXY
========================================================= */

const galaxy =
    new THREE.Group();

galaxy.rotation.x =
    Math.PI * 0.18;

galaxy.rotation.z =
    -0.12;

scene.add(galaxy);


/* =========================================================
   GALAXY PARTICLES
========================================================= */

const galaxyCount =
    mobile
        ? 18000
        : lowPower
            ? 24000
            : 38000;


const galaxyPositions =
    new Float32Array(
        galaxyCount * 3
    );


const galaxyColors =
    new Float32Array(
        galaxyCount * 3
    );


/*
   Galaxy palette:

   Blue
   Violet
   Pink
   Cyan
   Gold
*/


const palette = [

    new THREE.Color(0x4f7cff),

    new THREE.Color(0x8b5cff),

    new THREE.Color(0xd84cff),

    new THREE.Color(0x4fdfff),

    new THREE.Color(0xffb35c)

];


for (
    let i = 0;
    i < galaxyCount;
    i++
) {

    /*
        Normalized position
    */

    const radius =
        Math.random();


    /*
        Spiral arms
    */

    const arms = 5;

    const arm =
        i % arms;


    const baseAngle =
        (
            arm /
            arms
        ) *
        Math.PI *
        2;


    const rotation =
        radius *
        Math.PI *
        5.5;


    const randomAngle =
        (
            Math.random() -
            0.5
        ) *
        (
            0.55 +
            radius * 0.35
        );


    const angle =
        baseAngle +
        rotation +
        randomAngle;


    /*
        Galaxy width

        Wider near the outside,
        tight near the center.
    */

    const spread =
        (
            0.04 +
            radius * 0.32
        );


    const distance =
        radius * 7.5;


    const x =
        Math.cos(angle) *
        distance;


    const z =
        Math.sin(angle) *
        distance;


    /*
        Thin galaxy disk
    */

    const y =
        (
            Math.random() -
            0.5
        ) *
        spread;


    const index =
        i * 3;


    galaxyPositions[index] =
        x;

    galaxyPositions[index + 1] =
        y;

    galaxyPositions[index + 2] =
        z;


    /*
        Color based on radius
    */

    let color;


    if (
        radius < 0.16
    ) {

        color =
            palette[4];

    } else if (
        radius < 0.35
    ) {

        color =
            palette[
                Math.floor(
                    Math.random() * 3
                )
            ];

    } else {

        color =
            palette[
                Math.floor(
                    Math.random() *
                    palette.length
                )
            ];

    }


    /*
        Slight random brightness
    */

    const brightness =
        THREE.MathUtils.randFloat(
            0.55,
            1.0
        );


    galaxyColors[index] =
        color.r * brightness;

    galaxyColors[index + 1] =
        color.g * brightness;

    galaxyColors[index + 2] =
        color.b * brightness;

}


/* =========================================================
   GALAXY GEOMETRY
========================================================= */

const galaxyGeometry =
    new THREE.BufferGeometry();


galaxyGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        galaxyPositions,
        3
    )
);


galaxyGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(
        galaxyColors,
        3
    )
);


/* =========================================================
   GALAXY SHADER
========================================================= */

const galaxyMaterial =
    new THREE.ShaderMaterial({

        transparent: true,

        depthWrite: false,

        vertexColors: true,

        blending:
            THREE.AdditiveBlending,

        uniforms: {

            uTime: {
                value: 0
            }

        },

        vertexShader: `

            uniform float uTime;

            attribute vec3 color;

            varying vec3 vColor;

            void main() {

                vColor = color;

                vec3 p = position;

                /*
                    Very subtle vertical movement.
                */

                p.y +=
                    sin(
                        p.x * 0.35 +
                        uTime * 0.15
                    ) *
                    0.025;

                vec4 mvPosition =
                    modelViewMatrix *
                    vec4(
                        p,
                        1.0
                    );

                gl_PointSize =
                    1.8 *
                    (
                        300.0 /
                        -mvPosition.z
                    );

                gl_PointSize =
                    clamp(
                        gl_PointSize,
                        0.6,
                        3.2
                    );

                gl_Position =
                    projectionMatrix *
                    mvPosition;

            }

        `,

        fragmentShader: `

            varying vec3 vColor;

            void main() {

                vec2 uv =
                    gl_PointCoord -
                    0.5;

                float d =
                    length(uv);

                float alpha =
                    1.0 -
                    smoothstep(
                        0.05,
                        0.5,
                        d
                    );

                alpha *= 0.82;

                gl_FragColor =
                    vec4(
                        vColor,
                        alpha
                    );

            }

        `

    });


const galaxyPoints =
    new THREE.Points(
        galaxyGeometry,
        galaxyMaterial
    );


galaxy.add(
    galaxyPoints
);


/* =========================================================
   GALAXY CORE GLOW
========================================================= */

const glowGeometry =
    new THREE.SphereGeometry(
        1.0,
        mobile ? 16 : 24,
        mobile ? 16 : 24
    );


const glowMaterial =
    new THREE.ShaderMaterial({

        transparent: true,

        depthWrite: false,

        blending:
            THREE.AdditiveBlending,

        uniforms: {

            uColor: {
                value:
                    new THREE.Color(
                        0xff9b4a
                    )
            },

            uTime: {
                value: 0
            }

        },

        vertexShader: `

            varying vec3 vNormal;

            void main() {

                vNormal =
                    normalize(
                        normalMatrix *
                        normal
                    );

                gl_Position =
                    projectionMatrix *
                    modelViewMatrix *
                    vec4(
                        position,
                        1.0
                    );

            }

        `,

        fragmentShader: `

            uniform vec3 uColor;

            uniform float uTime;

            varying vec3 vNormal;

            void main() {

                float intensity =
                    pow(
                        0.75 -
                        dot(
                            vNormal,
                            vec3(
                                0.0,
                                0.0,
                                1.0
                            )
                        ),
                        2.0
                    );

                float pulse =
                    0.9 +
                    sin(
                        uTime * 1.5
                    ) *
                    0.08;

                gl_FragColor =
                    vec4(
                        uColor,
                        intensity *
                        pulse *
                        0.8
                    );

            }

        `

    });


const galaxyGlow =
    new THREE.Mesh(
        glowGeometry,
        glowMaterial
    );


galaxyGlow.scale.set(
    1.5,
    0.6,
    1.5
);


galaxy.add(
    galaxyGlow
);


/* =========================================================
   STAR FIELD
========================================================= */

const starCount =
    mobile
        ? 900
        : 1800;


const starPositions =
    new Float32Array(
        starCount * 3
    );


for (
    let i = 0;
    i < starCount;
    i++
) {

    const index =
        i * 3;


    const radius =
        THREE.MathUtils.randFloat(
            10,
            35
        );


    const angle =
        Math.random() *
        Math.PI *
        2;


    starPositions[index] =
        Math.cos(angle) *
        radius;


    starPositions[index + 1] =
        THREE.MathUtils.randFloat(
            -16,
            16
        );


    starPositions[index + 2] =
        Math.sin(angle) *
        radius;

}


const starsGeometry =
    new THREE.BufferGeometry();


starsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        starPositions,
        3
    )
);


const starsMaterial =
    new THREE.PointsMaterial({

        color: 0xffffff,

        size:
            mobile
                ? 0.025
                : 0.035,

        transparent: true,

        opacity: 0.65,

        depthWrite: false

    });


const stars =
    new THREE.Points(
        starsGeometry,
        starsMaterial
    );


scene.add(
    stars
);


/* =========================================================
   3D CENTRAL STRUCTURE
========================================================= */

const structure =
    new THREE.Group();


structure.position.set(
    0,
    0.1,
    0
);


world.add(
    structure
);


/* =========================================================
   MATERIALS
========================================================= */

const metal =
    new THREE.MeshStandardMaterial({

        color: 0x303848,

        metalness: 0.88,

        roughness: 0.22

    });


const silver =
    new THREE.MeshStandardMaterial({

        color: 0xcbd5ff,

        metalness: 0.9,

        roughness: 0.18

    });


const crystal =
    new THREE.MeshPhysicalMaterial({

        color: 0x536dff,

        metalness: 0.15,

        roughness: 0.08,

        transmission:
            mobile ? 0.15 : 0.45,

        transparent: true,

        opacity:
            mobile ? 0.7 : 0.55

    });


/* =========================================================
   MAIN CRYSTAL
========================================================= */

const crystalGeometry =
    new THREE.IcosahedronGeometry(
        1.25,
        mobile ? 1 : 2
    );


const crystalMesh =
    new THREE.Mesh(
        crystalGeometry,
        crystal
    );


structure.add(
    crystalMesh
);


/* =========================================================
   INNER ENERGY CORE
========================================================= */

const energyGeometry =
    new THREE.IcosahedronGeometry(
        0.55,
        2
    );


const energyMaterial =
    new THREE.MeshBasicMaterial({

        color: 0xff75e6

    });


const energyCore =
    new THREE.Mesh(
        energyGeometry,
        energyMaterial
    );


structure.add(
    energyCore
);


/* =========================================================
   CRYSTAL WIREFRAME
========================================================= */

const wireGeometry =
    new THREE.IcosahedronGeometry(
        1.4,
        mobile ? 1 : 2
    );


const wireMaterial =
    new THREE.MeshBasicMaterial({

        color: 0x66baff,

        wireframe: true,

        transparent: true,

        opacity: 0.32

    });


const wire =
    new THREE.Mesh(
        wireGeometry,
        wireMaterial
    );


structure.add(
    wire
);


/* =========================================================
   ORBIT RINGS
========================================================= */

const rings =
    new THREE.Group();


structure.add(
    rings
);


const ringCount =
    mobile ? 3 : 4;


for (
    let i = 0;
    i < ringCount;
    i++
) {

    const ringGeometry =
        new THREE.TorusGeometry(
            1.7 +
                i * 0.38,

            0.012,

            6,

            96
        );


    const ringMaterial =
        new THREE.MeshBasicMaterial({

            color:
                i % 2 === 0
                    ? 0x5e8cff
                    : 0xd46cff,

            transparent: true,

            opacity: 0.7

        });


    const ring =
        new THREE.Mesh(
            ringGeometry,
            ringMaterial
        );


    ring.rotation.x =
        Math.PI / 2;


    ring.rotation.z =
        i * 0.55;


    rings.add(
        ring
    );

}


/* =========================================================
   ENERGY LINES
========================================================= */

const energyLines =
    new THREE.Group();


structure.add(
    energyLines
);


for (
    let i = 0;
    i < 8;
    i++
) {

    const points = [];


    const angle =
        (
            i /
            8
        ) *
        Math.PI *
        2;


    for (
        let j = 0;
        j < 12;
        j++
    ) {

        const radius =
            1.4 +
            j * 0.12;


        points.push(
            new THREE.Vector3(
                Math.cos(angle) *
                    radius,

                Math.sin(
                    j * 0.7
                ) *
                    0.15,

                Math.sin(angle) *
                    radius
            )
        );

    }


    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(
                points
            );


    const material =
        new THREE.LineBasicMaterial({

            color:
                i % 2
                    ? 0xff65d9
                    : 0x5ea7ff,

            transparent: true,

            opacity: 0.35

        });


    const line =
        new THREE.Line(
            geometry,
            material
        );


    energyLines.add(
        line
    );

}


/* =========================================================
   FLOATING OBJECTS
========================================================= */

const floating =
    new THREE.Group();


world.add(
    floating
);


const floatingCount =
    mobile ? 7 : 12;


for (
    let i = 0;
    i < floatingCount;
    i++
) {

    const size =
        THREE.MathUtils.randFloat(
            0.08,
            0.25
        );


    const geometry =
        new THREE.OctahedronGeometry(
            size,
            0
        );


    const material =
        new THREE.MeshStandardMaterial({

            color:
                i % 3 === 0
                    ? 0x597dff
                    : i % 3 === 1
                        ? 0xd456ff
                        : 0xff9c55,

            metalness: 0.8,

            roughness: 0.25

        });


    const object =
        new THREE.Mesh(
            geometry,
            material
        );


    object.position.set(

        THREE.MathUtils.randFloatSpread(
            8
        ),

        THREE.MathUtils.randFloat(
            -3,
            4
        ),

        THREE.MathUtils.randFloat(
            -1,
            4
        )

    );


    object.userData = {

        speed:
            THREE.MathUtils.randFloat(
                0.15,
                0.45
            ),

        offset:
            Math.random() *
            Math.PI *
            2,

        baseY:
            object.position.y

    };


    floating.add(
        object
    );

}


/* =========================================================
   MOUSE / TOUCH
========================================================= */

const pointer = {

    x: 0,

    y: 0

};


const pointerTarget = {

    x: 0,

    y: 0

};


window.addEventListener(
    "mousemove",
    (event) => {

        pointerTarget.x =
            (
                event.clientX /
                window.innerWidth
            ) *
            2 -
            1;


        pointerTarget.y =
            -(
                event.clientY /
                window.innerHeight
            ) *
            2 +
            1;

    },
    {
        passive: true
    }
);


window.addEventListener(
    "touchmove",
    (event) => {

        if (
            !event.touches.length
        ) {
            return;
        }


        const touch =
            event.touches[0];


        pointerTarget.x =
            (
                touch.clientX /
                window.innerWidth
            ) *
            2 -
            1;


        pointerTarget.y =
            -(
                touch.clientY /
                window.innerHeight
            ) *
            2 +
            1;

    },
    {
        passive: true
    }
);


/* =========================================================
   SCROLL
========================================================= */

let scrollAmount = 0;


window.addEventListener(
    "scroll",
    () => {

        scrollAmount =
            window.scrollY /
            window.innerHeight;

    },
    {
        passive: true
    }
);


/* =========================================================
   CLOCK
========================================================= */

const clock =
    new THREE.Clock();


/* =========================================================
   ANIMATION
========================================================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    const time =
        clock.getElapsedTime();


    /* ---------------------------------------
       POINTER SMOOTHING
    ---------------------------------------- */

    pointer.x +=
        (
            pointerTarget.x -
            pointer.x
        ) *
        0.025;


    pointer.y +=
        (
            pointerTarget.y -
            pointer.y
        ) *
        0.025;


    /* ---------------------------------------
       GALAXY ROTATION
    ---------------------------------------- */

    galaxy.rotation.y =
        time * 0.018;


    galaxy.rotation.x =
        Math.PI * 0.18 +
        Math.sin(
            time * 0.08
        ) *
        0.025;


    galaxyMaterial.uniforms.uTime.value =
        time;


    galaxyGlow.material.uniforms.uTime.value =
        time;


    /* ---------------------------------------
       STARS
    ---------------------------------------- */

    stars.rotation.y =
        time * 0.003;


    /* ---------------------------------------
       CENTRAL STRUCTURE
    ---------------------------------------- */

    structure.rotation.y =
        time * 0.09 +
        pointer.x * 0.25;


    structure.rotation.x =
        Math.sin(
            time * 0.25
        ) *
        0.06 +
        pointer.y * 0.12;


    /* ---------------------------------------
       CRYSTAL
    ---------------------------------------- */

    crystalMesh.rotation.x =
        time * 0.15;


    crystalMesh.rotation.y =
        time * 0.2;


    energyCore.rotation.x =
        -time * 0.35;


    energyCore.rotation.y =
        time * 0.25;


    wire.rotation.x =
        -time * 0.1;


    wire.rotation.y =
        time * 0.12;


    /* ---------------------------------------
       RINGS
    ---------------------------------------- */

    rings.rotation.y =
        time * 0.14;


    rings.rotation.x =
        Math.sin(
            time * 0.3
        ) *
        0.15;


    /* ---------------------------------------
       ENERGY LINES
    ---------------------------------------- */

    energyLines.rotation.y =
        -time * 0.18;


    /* ---------------------------------------
       FLOATING OBJECTS
    ---------------------------------------- */

    floating.children.forEach(
        (object) => {

            object.rotation.x +=
                0.003;

            object.rotation.y +=
                0.004;


            object.position.y =
                object.userData.baseY +
                Math.sin(
                    time *
                    object.userData.speed +
                    object.userData.offset
                ) *
                0.18;

        }
    );


    /* ---------------------------------------
       CAMERA
    ---------------------------------------- */

    const cameraTargetX =
        pointer.x * 0.65;


    const cameraTargetY =
        0.8 +
        pointer.y * 0.35;


    camera.position.x +=
        (
            cameraTargetX -
            camera.position.x
        ) *
        0.018;


    camera.position.y +=
        (
            cameraTargetY -
            camera.position.y
        ) *
        0.018;


    camera.position.z =
        9 -
        Math.min(
            scrollAmount * 1.15,
            2.7
        );


    camera.lookAt(
        0,
        0,
        0
    );


    /* ---------------------------------------
       LIGHT ANIMATION
    ---------------------------------------- */

    blueLight.position.x =
        Math.sin(
            time * 0.35
        ) *
        5;


    blueLight.position.z =
        Math.cos(
            time * 0.35
        ) *
        5;


    purpleLight.position.x =
        Math.cos(
            time * 0.28
        ) *
        5;


    purpleLight.position.z =
        Math.sin(
            time * 0.28
        ) *
        4;


    goldLight.position.y =
        2.5 +
        Math.sin(
            time * 0.5
        ) *
        0.8;


    /* ---------------------------------------
       RENDER
    ---------------------------------------- */

    renderer.render(
        scene,
        camera
    );

}


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        const newMobile =
            window.innerWidth <= 800;


        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio || 1,
                newMobile
                    ? 1.25
                    : 1.5
            )
        );

    },
    {
        passive: true
    }
);


/* =========================================================
   START
========================================================= */

animate();
