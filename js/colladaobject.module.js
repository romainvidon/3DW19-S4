import { ColladaLoader } from './ColladaLoader.js';
import * as THREE from './three.module.js';

export class ColladaObject extends THREE.Object3D {
    
    link;
    ready;
    events;

    constructor(name, link = "", scene){
        super();
        this.events = new EventTarget();
        this.type = "ColladaObject";
        const loadingManager = new THREE.LoadingManager( );
        const loader = new ColladaLoader( loadingManager );
        let currentObject = this;

        loader.load( './model/'+name+'.dae', function ( collada ) {
            currentObject.add(collada.scene);
            scene.add(currentObject);
            currentObject.ready = true;
            currentObject.link = link;
            currentObject.events.dispatchEvent(new Event('loaded'));
            currentObject.castShadow = true; //default is false
        },
        function ( xhr ) {
            // chargement du modèle
            // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.error( error);    
        } );
    }

    onClick(){
        if(this.link != ""){
            window.open(this.link, "_blank");
        }        
    }
}