// Three.js setup
let scene, camera, renderer;
let flowers = [];

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 8);
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg-canvas'),
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(10, 10, 10);
    scene.add(mainLight);
    
    const pinkLight = new THREE.PointLight(0xff69b4, 1, 15);
    pinkLight.position.set(-5, 5, 5);
    scene.add(pinkLight);
    
    createFlowers();
    animate();
    initializeCard();
    startCountdown();
}

function createFlower() {
    const group = new THREE.Group();
    
    // Pétalos
    const petalGeometry = new THREE.ConeGeometry(0.2, 0.5, 32);
    const petalMaterial = new THREE.MeshPhongMaterial({ color: 0xffb7c5 });
    
    for (let i = 0; i < 5; i++) {
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        petal.position.y = 0.3;
        petal.rotation.x = Math.PI / 4;
        petal.rotation.y = (i / 5) * Math.PI * 2;
        group.add(petal);
    }
    
    // Tallo
    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 32);
    const stemMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = -1;
    group.add(stem);
    
    return group;
}

function createFlowers() {
    for (let i = 0; i < 15; i++) {
        const flower = createFlower();
        flower.position.set(
            (Math.random() - 0.5) * 20,
            -2,
            (Math.random() - 0.5) * 20
        );
        flower.rotation.y = Math.random() * Math.PI * 2;
        flowers.push(flower);
        scene.add(flower);
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    flowers.forEach((flower, index) => {
        flower.rotation.y += 0.005;
        flower.position.y = -2 + Math.sin(Date.now() * 0.001 + index) * 0.2;
    });
    
    renderer.render(scene, camera);
}

// Card functionality
function initializeCard() {
    const card = document.querySelector('.card');
    const openBtn = document.querySelector('.open-card-btn');
    const closeBtn = document.querySelector('.close-card-btn');

    openBtn.addEventListener('click', () => {
        gsap.to(card, {
            rotationY: 180,
            duration: 1,
            ease: "power2.inOut"
        });
    });

    closeBtn.addEventListener('click', () => {
        gsap.to(card, {
            rotationY: 0,
            duration: 1,
            ease: "power2.inOut"
        });
    });
}

// Countdown functionality
function startCountdown() {
    function updateCountdown() {
        const now = new Date();
        const target = new Date();
        target.setHours(24, 0, 0, 0);
        
        const diff = target - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('countdown').textContent = 
            `${hours}h ${minutes}m ${seconds}s`;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();
}

// Initialize Fancybox
Fancybox.bind("[data-fancybox]", {
    Carousel: {
        friction: 0.8
    },
    Thumbs: {
        type: "classic"
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start everything
window.addEventListener('load', init);