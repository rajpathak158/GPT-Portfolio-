import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


/* =====================================================
   RAJ PATHAK — 3D PORTFOLIO
   STEP 2 — FUTURISTIC WEBGL ENVIRONMENT
===================================================== */


/* =====================================================
   CANVAS
===================================================== */

const canvas = document.querySelector("#webgl");

if (!canvas) {
    throw new Error("WebGL canvas not found.");
}


/* =====================================================
   SCENE
===================================================== */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x050505);


/* =====================================================
   FOG
===================================================== */

scene.fog = new THREE.FogExp2(
    0x050505,
    0.045
);


/* =====================================================
   CAMERA
===================================================== */

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(
    0,
    1.5,
    9
);


/* =====================================================
   RENDERER
===================================================== */

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1.8)
);

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.15;


/* =====================================================
   LIGHTING
===================================================== */

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        0.25
    );

scene.add(ambientLight);


const keyLight =
    new THREE.DirectionalLight(
        0xffffff,
        2.2
    );

keyLight.position.set(
    4,
    6,
    5
);

scene.add(keyLight);


const rimLight =
    new THREE.PointLight(
        0x6688ff,
        15,
        20
    );

rimLight.position.set(
    -5,
    2,
    2
);

scene.add(rimLight);


const secondaryLight =
    new THREE.PointLight(
        0xffffff,
        8,
        15
    );

secondaryLight.position.set(
    4,
    -2,
    4
);

scene.add(secondaryLight);


/* =====================================================
   MAIN 3D WORLD
===================================================== */

const world =
    new THREE.Group();

scene.add(world);


/* =====================================================
   CENTRAL STRUCTURE
===================================================== */

const structure =
    new THREE.Group();

world.add(structure);


/* =====================================================
   MATERIALS
===================================================== */

const darkMetal =
    new THREE.MeshStandardMaterial({

        color: 0x171717,

        metalness: 0.9,

        roughness: 0.24

    });


const glassMaterial =
    new THREE.MeshPhysicalMaterial({

        color: 0x303030,

        metalness: 0.2,

        roughness: 0.12,

        transmission: 0.55,

        transparent: true,

        opacity: 0.7,

        thickness: 0.4

    });


const brightMaterial =
    new THREE.MeshStandardMaterial({

        color: 0xdcdcdc,

        metalness: 0.85,

        roughness: 0.18,

        emissive: 0x111111

    });


/* =====================================================
   CENTRAL CORE
===================================================== */

const coreGeometry =
    new THREE.IcosahedronGeometry(
        1.45,
        2
    );

const core =
    new THREE.Mesh(
        coreGeometry,
        glassMaterial
    );

structure.add(core);


/* =====================================================
   INNER CORE
===================================================== */

const innerGeometry =
    new THREE.IcosahedronGeometry(
        0.72,
        2
    );

const inner =
    new THREE.Mesh(
        innerGeometry,
        brightMaterial
    );

structure.add(inner);


/* =====================================================
   ROTATING RINGS
===================================================== */

const ringGroup =
    new THREE.Group();

structure.add(ringGroup);


for (let i = 0; i < 4; i++) {

    const ringGeometry =
        new THREE.TorusGeometry(
            2.0 + i * 0.35,
            0.012,
            8,
            160
        );

    const ring =
        new THREE.Mesh(
            ringGeometry,
            brightMaterial
        );

    ring.rotation.x =
        Math.PI / 2;

    ring.rotation.z =
        i * 0.45;

    ringGroup.add(ring);
}


/* =====================================================
   ARCHITECTURAL BARS
===================================================== */

const bars =
    new THREE.Group();

structure.add(bars);


for (let i = 0; i < 18; i++) {

    const geometry =
        new THREE.BoxGeometry(
            0.07,
            3.5,
            0.07
        );

    const bar =
        new THREE.Mesh(
            geometry,
            darkMetal
        );

    const angle =
        (i / 18) * Math.PI * 2;

    const radius = 2.2;

    bar.position.x =
        Math.cos(angle) * radius;

    bar.position.z =
        Math.sin(angle) * radius;

    bar.rotation.y =
        -angle;

    bar.rotation.z =
        Math.sin(angle) * 0.35;

    bars.add(bar);
}


/* =====================================================
   FLOATING CUBES
===================================================== */

const cubes =
    new THREE.Group();

world.add(cubes);


for (let i = 0; i < 25; i++) {

    const size =
        THREE.MathUtils.randFloat(
            0.05,
            0.22
        );

    const geometry =
        new THREE.BoxGeometry(
            size,
            size,
            size
        );

    const cube =
        new THREE.Mesh(
            geometry,
            darkMetal
        );

    cube.position.set(

        THREE.MathUtils.randFloatSpread(9),

        THREE.MathUtils.randFloat(
            -3,
            4
        ),

        THREE.MathUtils.randFloat(
            -4,
            3
        )

    );

    cube.rotation.set(

        Math.random() * Math.PI,

        Math.random() * Math.PI,

        Math.random() * Math.PI

    );

    cube.userData.speed =
        THREE.MathUtils.randFloat(
            0.1,
            0.5
        );

    cubes.add(cube);
}


/* =====================================================
   PARTICLE FIELD
===================================================== */

const particleCount =
    window.innerWidth < 700
        ? 900
        : 1800;


const particleGeometry =
    new THREE.BufferGeometry();


const positions =
    new Float32Array(
        particleCount * 3
    );


for (
    let i = 0;
    i < particleCount;
    i++
) {

    const radius =
        THREE.MathUtils.randFloat(
            4,
            18
        );

    const angle =
        Math.random() *
        Math.PI *
        2;

    positions[i * 3] =
        Math.cos(angle) * radius;

    positions[i * 3 + 1] =
        THREE.MathUtils.randFloat(
            -7,
            8
        );

    positions[i * 3 + 2] =
        Math.sin(angle) * radius;

}


particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        positions,
        3
    )
);


const particleMaterial =
    new THREE.PointsMaterial({

        color: 0xffffff,

        size:
            window.innerWidth < 700
                ? 0.025
                : 0.035,

        transparent: true,

        opacity: 0.65,

        depthWrite: false

    });


const particles =
    new THREE.Points(
        particleGeometry,
        particleMaterial
    );

scene.add(particles);


/* =====================================================
   FLOOR GRID
===================================================== */

const grid =
    new THREE.GridHelper(
        40,
        40,
        0x222222,
        0x111111
    );

grid.position.y = -3.4;

grid.material.transparent = true;
grid.material.opacity = 0.2;

scene.add(grid);


/* =====================================================
   MOUSE INTERACTION
===================================================== */

const mouse = {

    x: 0,
    y: 0

};

const targetMouse = {

    x: 0,
    y: 0

};


window.addEventListener(
    "mousemove",
    (event) => {

        targetMouse.x =
            (event.clientX /
                window.innerWidth) *
            2 - 1;

        targetMouse.y =
            -(event.clientY /
                window.innerHeight) *
            2 + 1;

    }
);


/* =====================================================
   TOUCH
===================================================== */

window.addEventListener(
    "touchmove",
    (event) => {

        if (!event.touches.length)
            return;

        targetMouse.x =
            (event.touches[0].clientX /
                window.innerWidth) *
            2 - 1;

        targetMouse.y =
            -(event.touches[0].clientY /
                window.innerHeight) *
            2 + 1;

    },
    { passive: true }
);


/* =====================================================
   SCROLL
===================================================== */

let scrollY = 0;

window.addEventListener(
    "scroll",
    () => {

        scrollY =
            window.scrollY /
            window.innerHeight;

    },
    { passive: true }
);


/* =====================================================
   CLOCK
===================================================== */

const clock =
    new THREE.Clock();


/* =====================================================
   ANIMATION LOOP
===================================================== */

function animate() {

    requestAnimationFrame(
        animate
    );

    const elapsed =
        clock.getElapsedTime();


    /* -----------------------------------------
       SMOOTH MOUSE
    ------------------------------------------ */

    mouse.x +=
        (targetMouse.x - mouse.x)
        * 0.035;

    mouse.y +=
        (targetMouse.y - mouse.y)
        * 0.035;


    /* -----------------------------------------
       CENTRAL STRUCTURE
    ------------------------------------------ */

    structure.rotation.y =
        elapsed * 0.12 +
        mouse.x * 0.25;

    structure.rotation.x =
        Math.sin(elapsed * 0.25)
        * 0.08 +
        mouse.y * 0.12;


    /* -----------------------------------------
       CORE
    ------------------------------------------ */

    core.rotation.x =
        elapsed * 0.15;

    core.rotation.y =
        elapsed * 0.2;


    inner.rotation.x =
        -elapsed * 0.25;

    inner.rotation.y =
        -elapsed * 0.18;


    /* -----------------------------------------
       RINGS
    ------------------------------------------ */

    ringGroup.rotation.y =
        elapsed * 0.16;

    ringGroup.rotation.x =
        Math.sin(elapsed * 0.25)
        * 0.2;


    /* -----------------------------------------
       BARS
    ------------------------------------------ */

    bars.rotation.y =
        -elapsed * 0.08;


    /* -----------------------------------------
       FLOATING CUBES
    ------------------------------------------ */

    cubes.children.forEach(
        (cube, index) => {

            cube.rotation.x +=
                0.002 *
                cube.userData.speed;

            cube.rotation.y +=
                0.003 *
                cube.userData.speed;

            cube.position.y +=
                Math.sin(
                    elapsed *
                    cube.userData.speed +
                    index
                ) * 0.0007;

        }
    );


    /* -----------------------------------------
       PARTICLES
    ------------------------------------------ */

    particles.rotation.y =
        elapsed * 0.015;

    particles.rotation.x =
        Math.sin(elapsed * 0.05)
        * 0.04;


    /* -----------------------------------------
       CAMERA
    ------------------------------------------ */

    const targetCameraX =
        mouse.x * 0.8;

    const targetCameraY =
        1.5 +
        mouse.y * 0.45;

    camera.position.x +=
        (targetCameraX -
            camera.position.x)
        * 0.025;

    camera.position.y +=
        (targetCameraY -
            camera.position.y)
        * 0.025;


    /* -----------------------------------------
       SCROLL CAMERA
    ------------------------------------------ */

    camera.position.z =
        9 -
        Math.min(scrollY * 1.8, 3.5);


    camera.lookAt(
        0,
        0,
        0
    );


    /* -----------------------------------------
       LIGHT MOVEMENT
    ------------------------------------------ */

    rimLight.position.x =
        Math.sin(elapsed * 0.4) * 5;

    rimLight.position.z =
        Math.cos(elapsed * 0.4) * 4;


    /* -----------------------------------------
       RENDER
    ------------------------------------------ */

    renderer.render(
        scene,
        camera
    );

}


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

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                1.8
            )
        );

    }
);


/* =====================================================
   START
===================================================== */

animate();
