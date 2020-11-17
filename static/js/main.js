// add metalness



let Colors = {
    blue: 0xffffff,
};

window.addEventListener('load', init, false);

let controls;

function init() {
    // set up the scene, the camera and the renderer
    createScene();

    // add the lights
    createLights();

    // add the objects
    createCube();
    createSphere();

    // start a loop that will update the objects' positions 
    // and render the scene on each frame
    loop();

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.noPan = true;
    controls.noZoom = true;
}

var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
    renderer, container;

function createScene() {
    // Get the width and the height of the screen,
    // use them to set up the aspect ratio of the camera 
    // and the size of the renderer.
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    // Create the scene
    scene = new THREE.Scene();

    // Create the camera
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 10;
    farPlane = 1000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );

    // Set the position of the camera
    camera.position.x = 0;
    camera.position.z = 100;
    camera.position.y = 0;

    // Create the renderer
    renderer = new THREE.WebGLRenderer({
        // Allow transparency to show the gradient background
        // we defined in the CSS
        alpha: true,

        // Activate the anti-aliasing; this is less performant,
        // but, as our project is low-poly based, it should be fine :)
        antialias: true
    });

    // Define the size of the renderer; in this case,
    // it will fill the entire screen
    renderer.setSize(WIDTH, HEIGHT);

    // Enable shadow rendering
    renderer.shadowMap.enabled = true;

    // Add the DOM element of the renderer to the 
    // container we created in the HTML
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    // Listen to the screen: if the user resizes it
    // we have to update the camera and the renderer size
    window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
    // update height and width of the renderer and the camera
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

let hemisphereLight, shadowLight;

function createLights() {
    // A hemisphere light is a gradient colored light; 
    // the first parameter is the sky color, the second parameter is the ground color, 
    // the third parameter is the intensity of the light
    //hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)

    // A directional light shines from a specific direction. 
    // It acts like the sun, that means that all the rays produced are parallel. 
    shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);

    // Set the direction of the light  
    shadowLight.position.set(150, 350, 350);

    // Allow shadow casting 
    shadowLight.castShadow = true;

    // define the visible area of the projected shadow
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    // define the resolution of the shadow; the higher the better, 
    // but also the more expensive and less performant
    shadowLight.shadow.mapSize.width = 1024;
    shadowLight.shadow.mapSize.height = 1024;

    // to activate the lights, just add them to the scene
    //scene.add(hemisphereLight);  
    scene.add(shadowLight);
}

const loader = new THREE.CubeTextureLoader();

/*const texture = loader.load([
  'https://i.imgur.com/IlysAGA.png', //px
  'https://i.imgur.com/yDiQdbx.png', //nx
  'https://i.imgur.com/zNuech5.png', //py
  'https://i.imgur.com/cLfoPW4.png', //ny
  'https://i.imgur.com/iWNKTMA.png', //pz
  'https://i.imgur.com/EnIyXsi.png', //nz
  ]);*/

const texture = loader.load([
    'https://i.imgur.com/IXMxN7H.png', //px 1 => 1
    'https://i.imgur.com/1mWI1fY.png', //ny 4 => 2
    'https://i.imgur.com/C8PrCUi.png', //nx 2 => 3
    'https://i.imgur.com/K6UhDSg.png', //nz 6 => 4
    'https://i.imgur.com/5WQYlHJ.png', //pz 5 => 5
    'https://i.imgur.com/6368FV9.png', //py 3 => 6
]);

const loaderOpacity = new THREE.CubeTextureLoader();

const textureOpacity = loaderOpacity.load([
    'https://i.imgur.com/zNuech5.png',
    /*'https://i.imgur.com/zNuech5.png',
    'https://i.imgur.com/zNuech5.png',
    'https://i.imgur.com/zNuech5.png',
    'https://i.imgur.com/zNuech5.png',
    'https://i.imgur.com/zNuech5.png',*/
]);

/*const textureOpacity = loaderOpacity.load([
  // [img]https://i.imgur.com/zNuech5.png[/img]
  'https://i.imgur.com/fvx9oFj.png', //px 1 => 1
  'https://i.imgur.com/QWNcMqW.png', //ny 4 => 2
  'https://i.imgur.com/ezbatGG.png', //nx 2 => 3
  'https://i.imgur.com/IIO3SXE.png', //nz 6 => 4
  'https://i.imgur.com/f4gi2h3.png', //pz 5 => 5
  'https://i.imgur.com/IDUtLSq.png', //py 3 => 6
  ]);*/

Cube = function () {

    // create the geometry (shape) of the cylinder;
    // the parameters are: 
    // radius top, radius bottom, height, number of segments on the radius, number of segments vertically
    var geom = new THREE.BoxGeometry(30, 30, 30);
    var geomL = new THREE.BoxGeometry(100, 100, 100);

    // create the material 
    // Phong material is better for specular highlights as it respond better to the light source
    var mat = new THREE.MeshStandardMaterial({
        color: Colors.blue,
        transparent: true,

        envMap: texture,
        opacity: .2,
        roughness: 0,
        metalness: 0.2,
        // set the color of the shine (dark grey, by default)
        specular: 0xfff,
        // allow inside and outside plane of the geometry to be visible
        side: THREE.DoubleSide,
        shading: THREE.FlatShading,
    });

    // To create an object in Three.js, we have to create a mesh 
    // which is a combination of a geometry and some material
    this.mesh = new THREE.Mesh(geom, mat);
    this.meshL = new THREE.Mesh(geomL, mat);

    // Allow the sea to receive shadows
    this.mesh.receiveShadow = true;
}

// Instantiate the sea and add it to the scene:

var cube;

function createCube() {
    cube = new Cube();

    // add the mesh to the scene
    scene.add(cube.mesh);
    //scene.add(cube.meshL);
}

Sphere = function () {

    // create the geometry (shape) of the cylinder;
    // the parameters are: 
    // radius top, radius bottom, height, number of segments on the radius, number of segments vertically
    var geom = new THREE.IcosahedronBufferGeometry(50, 3);
    var geomS = new THREE.IcosahedronBufferGeometry(40, 3);

    // create the material 
    var mat = new THREE.MeshStandardMaterial({
        color: Colors.blue,
        transparent: true,
        envMap: texture,
        //metalnessMap: textureOpacity,
        opacity: .2,
        roughness: 0,
        metalness: 0.2,
        //mat.alphaMap : textureOpacity,
        // set the color of the shine (dark grey, by default)
        specular: 0xffffff,
        // allow inside and outside plane of the geometry to be visible
        //side: THREE.DoubleSide
        side: THREE.FrontSide,
        //shading:THREE.FlatShading,
    });

    var matS = new THREE.MeshStandardMaterial({
        color: Colors.blue,
        transparent: true,
        envMap: texture,
        //metalnessMap: textureOpacity,
        opacity: 0.1,
        roughness: 0,
        metalness: 0.2,
        //mat.alphaMap : textureOpacity,
        // set the color of the shine (dark grey, by default)
        specular: 0xffffff,
        // allow inside and outside plane of the geometry to be visible
        //side: THREE.DoubleSide
        side: THREE.BackSide,
        //shading:THREE.FlatShading,
    });

    //mat.alphaMap : textureOpacity
    // To create an object in Three.js, we have to create a mesh 
    // which is a combination of a geometry and some material
    this.meshS = new THREE.Mesh(geom, matS);
    this.mesh = new THREE.Mesh(geom, mat);
    // Allow to receive shadows
    // this.mesh.receiveShadow = true; 
}

let sphere;

function createSphere() {
    sphere = new Sphere();
    scene.add(sphere.mesh);
    scene.add(sphere.meshS);
}

var composer = new EffectComposer(renderer);
//const composer = new THREE.EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

function loop() {
    // controls.update();
    // render the scene
    renderer.render(scene, camera);
    //composer.render();
    // call the loop function again
    requestAnimationFrame(loop);

}