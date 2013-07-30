var grampus = {
    settings: {
        threeJS: {
            renderer: {},
            camera: {},
            scene: {}
        },
        anatomy: {
            body: {
                bodyGeometricObject: {},
                cylinders: {
                    count: 11,
                    diameter: {
                        start: 5,
                        diff: 20
                    }
                }
            },
            tail: {
                tailGeometricObject: {}
            }
        },
        mouse: {
            x: 0,
            y: 0,
            timeDelay: 10,
            timeDelayFlag: 0
        }
    },

    init: function () {
        this.initThreeJS();
        this.drawBody();
        this.bindEvents();
    },

    bindEvents: function () {
        this.animateMoveBody();
        this.bindMouse();
    },

    initThreeJS: function () {
        var threeJS = this.settings.threeJS;
        threeJS.renderer = new THREE.WebGLRenderer();
        threeJS.renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
        document.body.appendChild(threeJS.renderer.domElement);
        threeJS.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000);
        threeJS.camera.position.z = 700;
        threeJS.scene = new THREE.Scene();
    },


    renderThreeJSResults: function () {
        var threeJS = this.settings.threeJS;
        threeJS.renderer.render(threeJS.scene, threeJS.camera);
    },

    bindMouse: function () {
        var self = this,
            mouse = self.settings.mouse;
        document.addEventListener( 'mousemove',
            function(ev) {
                if (mouse.timeDelayFlag) clearTimeout(mouse.timeDelayFlag);
                mouse.timeDelayFlag = setTimeout(function() {self.onMouseMove(ev);}, mouse.timeDelay);
            }
            , false );
    },

    onMouseMove: function (event) {
        var mouse = this.settings.mouse;
        mouse.x = ( event.clientX - window.innerWidth / 2 ) ;
        mouse.y =   -( event.clientY - window.innerHeight / 2 );
    },

    moveBodyToPoint: function () {
        var self = this,
            body = self.settings.anatomy.body.bodyGeometricObject,
            bodyCylinders = body.children,
            coordinates = self.settings.mouse;
        for (var i = 1; i <= bodyCylinders.length; i++) {
            var currentCylinder = bodyCylinders[i-1];
            currentCylinder.position.y += (coordinates.y - currentCylinder.position.y) / (i * 4);
            currentCylinder.position.x += (coordinates.x - currentCylinder.position.x) / (i * 4);
        }
        self.renderThreeJSResults();
    },

    animateMoveBody: function() {
        var self = this;
        window.requestAnimationFrame(function() {
            self.moveBodyToPoint();
            self.animateMoveBody();
        });
    },

    drawBody: function () {
        var selfSettings = this.settings,
            scene = selfSettings.threeJS.scene,
            body = selfSettings.anatomy.body,
            currentCircleDiameter = body.cylinders.diameter.start,
            diameterDiff = body.cylinders.diameter.diff,
            currentZ = 0;
        body.bodyGeometricObject = new THREE.Object3D();
        body.bodyGeometricObject.position.x = 0;
        scene.add(body.bodyGeometricObject);
        var middleCylinderIndex = body.cylinders.count/2;
        for (var i = 0; i < middleCylinderIndex; i++) {
            this.drawBodyCircle(body.bodyGeometricObject, currentCircleDiameter, currentCircleDiameter + diameterDiff);
            currentCircleDiameter += diameterDiff;
        }
        var secondPartDiameterDiff = diameterDiff / 1.3;
        for (var j = middleCylinderIndex; j < body.cylinders.count; j++) {
            this.drawBodyCircle(body.bodyGeometricObject, currentCircleDiameter, currentCircleDiameter - secondPartDiameterDiff);
            currentCircleDiameter -= secondPartDiameterDiff;
        }
        this.drawTail(currentCircleDiameter, currentZ);
        this.renderThreeJSResults();

    },

    drawBodyCircle: function (bodyPart, startDiameter, endDiameter) {
        var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(startDiameter, endDiameter, 100, 50, 50, false), new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 'black'
        }));

        cylinder.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI / 2 ) );
        this.settings.anatomy.body.bodyGeometricObject.add(cylinder);
    },

    drawTail: function (currentCircleDiameter, currentZ) {
        var self = this,
            selfSettings = self.settings,
            scene = selfSettings.threeJS.scene,
            tail = selfSettings.anatomy.tail;

        tail.tailGeometricObject = new THREE.Object3D();

        while (currentCircleDiameter > 0) {
            this.drawBodyCircle(tail.tailGeometricObject, currentCircleDiameter, currentCircleDiameter);
            currentCircleDiameter -= 5;
        }
    }
};

grampus.init();