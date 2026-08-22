import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

/*
=========================================================
RAJ PATHAK PORTFOLIO
3D GALAXY ENGINE
STEP 5

Features:
- Colorful galaxy
- GPU-friendly particles
- Nebula layers
- Depth
- Mouse parallax
- Slow cinematic movement
- Mobile performance optimization
- Responsive canvas
=========================================================
*/


/* =====================================================
   CANVAS
===================================================== */

const canvas = document.getElementById("webgl");

if (!canvas) {
    console.warn("Galaxy canvas #webgl not found.");
} else {


/* =====================================================
   DEVICE / PERFORMANCE
===================================================== */

const isMobile =
    window.matchMedia("(max-width: 700px)").matches;

const isLowPower =
    navigator.hardwareConcurrency &&
    navigator.hardwareConcurrency <= 4;


/*
 * Reduce particle count on phones.
 */

const PARTICLE_COUNT =
    isMobile
        ? 7000
        : isLowPower
            ? 9000
            : 16000;


/* =====================================================
   SCENE
===================================================== */

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x02010a);


/* =====================================================
   CAMERA
===================================================== */

const camera =
    new THREE.PerspectiveCamera(
        55,
        window.innerWidth /
        window.innerHeight,
        0.1,
        250
    );

camera.position.set(
    0,
    2,
    24
);


/* =====================================================
   RENDERER
===================================================== */

const renderer =
    new THREE.WebGLRenderer({
        canvas,
        antialias: !isMobile,
        alpha: false,
        powerPreference: "high-performance"
    });


renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        isMobile ? 1.25 : 1.75
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

const galaxy =
    new THREE.Group();

scene.add(galaxy);


/* =====================================================
   GALAXY PARTICLES
===================================================== */

const positions =
    new Float32Array(
        PARTICLE_COUNT * 3
    );

const colors =
    new Float32Array(
        PARTICLE_COUNT * 3
    );

const sizes =
    new Float32Array(
        PARTICLE_COUNT
    );


/* =====================================================
   COLOR PALETTE
===================================================== */

const palette = [

    new THREE.Color(0x6c5ce7),

    new THREE.Color(0x00c6ff),

    new THREE.Color(0x8b5cf6),

    new THREE.Color(0xff4ecd),

    new THREE.Color(0x4facfe),

    new THREE.Color(0xffffff)

];


/* =====================================================
   GALAXY SETTINGS
===================================================== */

const galaxyRadius =
    isMobile ? 17 : 22;

const galaxyDepth =
    isMobile ? 3.5 : 5;

const arms = 4;

const armTwist = 2.8;


/* =====================================================
   CREATE GALAXY
===================================================== */

for (
    let i = 0;
    i < PARTICLE_COUNT;
    i++
) {

    const i3 = i * 3;


    /*
     * Distance from center.
     */

    const radius =
        Math.pow(
            Math.random(),
            0.65
        ) * galaxyRadius;


    /*
     * Which spiral arm?
     */

    const arm =
        i % arms;


    const armAngle =
        (arm / arms) *
        Math.PI *
        2;


    /*
     * Spiral rotation.
     */

    const spin =
        radius *
        armTwist;


    /*
     * Random spread.
     */

    const spread =
        (Math.random() - 0.5) *
        (
            0.35 +
            radius * 0.035
        );


    const angle =
        armAngle +
        spin +
        spread;


    /*
     * Slight vertical depth.
     */

    const y =
        (
            Math.random() -
            0.5
        ) *
        galaxyDepth *
        (
            1 -
            radius /
            galaxyRadius *
            0.35
        );


    /*
     * Position.
     */

    positions[i3] =
        Math.cos(angle) *
        radius;

    positions[i3 + 1] =
        y;

    positions[i3 + 2] =
        Math.sin(angle) *
        radius;


    /*
     * Color based on distance.
     */

    const colorIndex =
        Math.floor(
            Math.random() *
            palette.length
        );


    const color =
        palette[colorIndex].clone();


    /*
     * Slightly desaturate
     * some distant stars.
     */

    if (
        radius >
        galaxyRadius * 0.7
    ) {

        color.lerp(
            new THREE.Color(0x3a3470),
            0.35
        );

    }


    colors[i3] =
        color.r;

    colors[i3 + 1] =
        color.g;

    colors[i3 + 2] =
        color.b;


    /*
     * Particle size.
     */

    sizes[i] =
        0.5 +
        Math.random() *
        1.7;

}


/* =====================================================
   PARTICLE GEOMETRY
===================================================== */

const galaxyGeometry =
    new THREE.BufferGeometry();


galaxyGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        positions,
        3
    )
);


galaxyGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(
        colors,
        3
    )
);


galaxyGeometry.setAttribute(
    "size",
    new THREE.BufferAttribute(
        sizes,
        1
    )
);


/* =====================================================
   PARTICLE TEXTURE
===================================================== */

function createParticleTexture() {

    const size = 64;

    const particleCanvas =
        document.createElement("canvas");

    particleCanvas.width = size;
    particleCanvas.height = size;


    const context =
        particleCanvas.getContext("2d");


    const gradient =
        context.createRadialGradient(
            size / 2,
            size / 2,
            0,
            size / 2,
            size / 2,
            size / 2
        );


    gradient.addColorStop(
        0,
        "rgba(255,255,255,1)"
    );

    gradient.addColorStop(
        0.15,
        "rgba(255,255,255,0.95)"
    );

    gradient.addColorStop(
        0.45,
        "rgba(255,255,255,0.35)"
    );

    gradient.addColorStop(
        1,
        "rgba(255,255,255,0)"
    );


    context.fillStyle =
        gradient;

    context.fillRect(
        0,
        0,
        size,
        size
    );


    return new THREE.CanvasTexture(
        particleCanvas
    );

}


const particleTexture =
    createParticleTexture();


/* =====================================================
   PARTICLE SHADER
===================================================== */

const galaxyMaterial =
    new THREE.ShaderMaterial({

        transparent: true,

        depthWrite: false,

        blending:
            THREE.AdditiveBlending,

        vertexColors: true,

        uniforms: {

            uPixelRatio: {
                value:
                    renderer.getPixelRatio()
            },

            uTime: {
                value: 0
            }

        },


        vertexShader: `

            attribute float size;

            varying vec3 vColor;

            uniform float uPixelRatio;

            uniform float uTime;

            void main() {

                vColor = color;

                vec4 mvPosition =
                    modelViewMatrix *
                    vec4(position, 1.0);


                float depth =
                    -mvPosition.z;


                float pulse =
                    1.0 +
                    sin(
                        uTime * 1.2 +
                        position.x *
                        0.35
                    ) * 0.08;


                gl_PointSize =
                    size *
                    uPixelRatio *
                    7.0 *
                    pulse /
                    max(
                        depth * 0.045,
                        0.45
                    );


                gl_Position =
                    projectionMatrix *
                    mvPosition;

            }

        `,


        fragmentShader: `

            uniform sampler2D uTexture;

            varying vec3 vColor;

            void main() {

                float alpha =
                    texture2D(
                        uTexture,
                        gl_PointCoord
                    ).a;


                if(alpha < 0.02)
                    discard;


                gl_FragColor =
                    vec4(
                        vColor,
                        alpha
                    );

            }

        `

    });


/*
 * Add texture uniform after material creation.
 */

galaxyMaterial.uniforms.uTexture = {
    value: particleTexture
};


/* =====================================================
   GALAXY MESH
===================================================== */

const galaxyParticles =
    new THREE.Points(
        galaxyGeometry,
        galaxyMaterial
    );


galaxy.add(
    galaxyParticles
);


/* =====================================================
   CORE GLOW
===================================================== */

const coreGeometry =
    new THREE.SphereGeometry(
        isMobile ? 2.0 : 2.5,
        32,
        32
    );


const coreMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.18,
        blending:
            THREE.AdditiveBlending,
        depthWrite: false
    });


const core =
    new THREE.Mesh(
        coreGeometry,
        coreMaterial
    );


galaxy.add(core);


/* =====================================================
   INNER CORE
===================================================== */

const innerCoreGeometry =
    new THREE.SphereGeometry(
        isMobile ? 0.7 : 0.9,
        24,
        24
    );


const innerCoreMaterial =
    new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.7,
        blending:
            THREE.AdditiveBlending
    });


const innerCore =
    new THREE.Mesh(
        innerCoreGeometry,
        innerCoreMaterial
    );


galaxy.add(
    innerCore
);


/* =====================================================
   NEBULA CLOUDS
===================================================== */

function createNebula(
    color,
    position,
    scale,
    opacity
) {

    const geometry =
        new THREE.SphereGeometry(
            1,
            24,
            24
        );


    const material =
        new THREE.MeshBasicMaterial({

            color,

            transparent: true,

            opacity,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false

        });


    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );


    mesh.position.copy(
        position
    );


    mesh.scale.set(
        scale.x,
        scale.y,
        scale.z
    );


    galaxy.add(mesh);


    return mesh;

}


/* =====================================================
   COLORFUL NEBULA
===================================================== */

const nebulaOne =
    createNebula(
        0x304cff,
        new THREE.Vector3(
            -8,
            1,
            -4
        ),
        new THREE.Vector3(
            9,
            3,
            5
        ),
        0.035
    );


const nebulaTwo =
    createNebula(
        0xd72fff,
        new THREE.Vector3(
            7,
            -1,
            1
        ),
        new THREE.Vector3(
            8,
            3,
            5
        ),
        0.03
    );


const nebulaThree =
    createNebula(
        0x00d9ff,
        new THREE.Vector3(
            1,
            3,
            -7
        ),
        new THREE.Vector3(
            7,
            2.5,
            4
        ),
        0.025
    );


/* =====================================================
   STAR FIELD
===================================================== */

const starCount =
    isMobile
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

    const i3 =
        i * 3;


    const radius =
        35 +
        Math.random() *
        70;


    const theta =
        Math.random() *
        Math.PI *
        2;


    const phi =
        Math.acos(
            2 *
            Math.random()
            -
            1
        );


    starPositions[i3] =
        radius *
        Math.sin(phi) *
        Math.cos(theta);


    starPositions[i3 + 1] =
        radius *
        Math.cos(phi);


    starPositions[i3 + 2] =
        radius *
        Math.sin(phi) *
        Math.sin(theta);

}


/* =====================================================
   STAR GEOMETRY
===================================================== */

const starGeometry =
    new THREE.BufferGeometry();


starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        starPositions,
        3
    )
);


/* =====================================================
   STAR MATERIAL
===================================================== */

const starMaterial =
    new THREE.PointsMaterial({

        color: 0xffffff,

        size:
            isMobile
                ? 0.09
                : 0.12,

        transparent: true,

        opacity: 0.7,

        depthWrite: false,

        blending:
            THREE.AdditiveBlending

    });


const stars =
    new THREE.Points(
        starGeometry,
        starMaterial
    );


scene.add(stars);


/* =====================================================
   MOUSE
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
    "pointermove",
    (event) => {

        targetMouse.x =
            (
                event.clientX /
                window.innerWidth
            ) *
            2 -
            1;


        targetMouse.y =
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


/* =====================================================
   TOUCH
===================================================== */

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


        targetMouse.x =
            (
                touch.clientX /
                window.innerWidth
            ) *
            2 -
            1;


        targetMouse.y =
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


/* =====================================================
   CLOCK
===================================================== */

const clock =
    new THREE.Clock();


/* =====================================================
   ANIMATION
===================================================== */

function animate() {

    requestAnimationFrame(
        animate
    );


    const elapsed =
        clock.getElapsedTime();


    /* =================================================
       SMOOTH MOUSE
    ================================================= */

    mouse.x +=
        (
            targetMouse.x -
            mouse.x
        ) *
        0.035;


    mouse.y +=
        (
            targetMouse.y -
            mouse.y
        ) *
        0.035;



    /* =================================================
       GALAXY ROTATION
    ================================================= */

    galaxy.rotation.y =
        elapsed *
        0.025;


    galaxy.rotation.x =
        Math.sin(
            elapsed * 0.08
        ) *
        0.035;


    /* =================================================
       MOUSE PARALLAX
    ================================================= */

    galaxy.rotation.y +=
        mouse.x *
        0.08;


    galaxy.rotation.x +=
        mouse.y *
        0.035;



    /* =================================================
       CORE PULSE
    ================================================= */

    const pulse =
        1 +
        Math.sin(
            elapsed * 1.5
        ) *
        0.08;


    core.scale.setScalar(
        pulse
    );


    innerCore.scale.setScalar(
        1 +
        Math.sin(
            elapsed * 2.0
        ) *
        0.06
    );



    /* =================================================
       NEBULA MOTION
    ================================================= */

    nebulaOne.rotation.y =
        elapsed *
        0.025;


    nebulaTwo.rotation.y =
        -elapsed *
        0.018;


    nebulaThree.rotation.y =
        elapsed *
        0.015;



    /* =================================================
       STARS
    ================================================= */

    stars.rotation.y =
        elapsed *
        0.003;


    stars.rotation.x =
        Math.sin(
            elapsed * 0.04
        ) *
        0.015;



    /* =================================================
       SHADER TIME
    ================================================= */

    galaxyMaterial
        .uniforms
        .uTime
        .value =
        elapsed;



    /* =================================================
       CAMERA
    ================================================= */

    const targetCameraX =
        mouse.x *
        1.2;


    const targetCameraY =
        2 +
        mouse.y *
        0.7;


    camera.position.x +=
        (
            targetCameraX -
            camera.position.x
        ) *
        0.015;


    camera.position.y +=
        (
            targetCameraY -
            camera.position.y
        ) *
        0.015;


    camera.lookAt(
        0,
        0,
        0
    );



    /* =================================================
       RENDER
    ================================================= */

    renderer.render(
        scene,
        camera
    );

}


/* =====================================================
   START
===================================================== */

animate();


/* =====================================================
   RESIZE
===================================================== */

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
        height
    );


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            isMobile ? 1.25 : 1.75
        )
    );


    if (
        galaxyMaterial.uniforms
        .uPixelRatio
    ) {

        galaxyMaterial
            .uniforms
            .uPixelRatio
            .value =
            renderer.getPixelRatio();

    }

}


window.addEventListener(
    "resize",
    resize
);


/* =====================================================
   VISIBILITY OPTIMIZATION
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


} // END CANVAS CHECK
