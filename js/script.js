import * as THREE from './three.module.js';

import {
    ColladaObject
} from './colladaobject.module.js';

let test, scene, renderer, camera, container, pointer, raycaster;

init();
animate();


function init() {
    pointer = {
        x: 0,
        y: 0
    };
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    camera.position.z = 5;
    camera.position.y = 5;
    camera.position.x = 5;
    camera.lookAt(0,2,0);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    const ambientLight = new THREE.AmbientLight( 0xA0A0A0 ); // soft white light
    scene.add(ambientLight);
    const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
    scene.add( light );
    // quand la fenêtre change de taille, redimensionner
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('click', onClick);

    // Raycaster
    raycaster = new THREE.Raycaster();

    // objets
    test = new ColladaObject('treeHighCrooked', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', scene);

    test.events.addEventListener('loaded',(e)=>{
        console.log(test);
        test.scale.x = 2;
        test.scale.y = 2;
        test.scale.z = 2;
    });
}

function onClick() {
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
        let first = intersects[0];
        let obj = getColladaObject(first.object);
        console.log("Premier rencontré :");
        console.log(obj);
        
        if (obj) {
            obj.onClick();
        }
    }
}

function getColladaObject(mesh){
    let m = mesh;
    let trouve = false;
    while(!trouve){
        trouve = (m.type =="ColladaObject") || (m.type =="Scene");
        if(!trouve){
            m = m.parent;
        }
    }
    if(m.type =="ColladaObject"){
        return m;
    } else {
        return null;
    }
}

function animate() {
    requestAnimationFrame(animate);
    render();
    if (test.ready) {
        // test.rotation.y += .01;
    }
}

function render() {
    renderer.render(scene, camera);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onPointerMove(event) {

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

}