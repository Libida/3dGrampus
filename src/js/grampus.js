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
                    count: 7,
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
            xDiff: 0,
            yDiff: 0
        }
    },

    init: function () {
        this.initThreeJS();
        this.drawBody();
        this.bindEvents();
    },

    bindEvents: function () {
        var self = this;
        self.animateMoveBody();
        document.addEventListener( 'mousemove', self.onMouseMove, false );
    },

    onMouseMove: function (event) {
        var mouse = grampus.settings.mouse,
            prevY = mouse.y;
        mouse.x = ( event.clientX - window.innerWidth / 2 ) ;
        mouse.y =   -( event.clientY - window.innerHeight / 2 );
        mouse.yDiff = mouse.y - prevY;
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
            this.drawBodyCircle(body.bodyGeometricObject, currentCircleDiameter, currentCircleDiameter + diameterDiff, 0, 0, 0);
            currentCircleDiameter += diameterDiff;
        }
        var secondPartDiameterDiff = diameterDiff / 1.3;
        for (var j = middleCylinderIndex; j < body.cylinders.count; j++) {
            this.drawBodyCircle(body.bodyGeometricObject, currentCircleDiameter, currentCircleDiameter - secondPartDiameterDiff, 0, 0, 0);
            currentCircleDiameter -= secondPartDiameterDiff;
        }
        this.drawTail(currentCircleDiameter, currentZ);
        this.renderThreeJSResults();

    },

    drawBodyCircle: function (bodyPart, startDiameter, endDiameter, x, y, z) {
        var material = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('img/crate.jpg')
        });

        var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(startDiameter, endDiameter, 100, 50, 50, false), material);

        cylinder.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI / 2 ) );
//            bodyPart.add(cylinder);
        this.settings.anatomy.body.bodyGeometricObject.add(cylinder);

        cylinder.position.x = x;
        cylinder.position.y = y;
        cylinder.position.z = z;
    },

    drawTail: function (currentCircleDiameter, currentZ) {
        var self = this,
            selfSettings = self.settings,
            scene = selfSettings.threeJS.scene,
            tail = selfSettings.anatomy.tail;

        tail.tailGeometricObject = new THREE.Object3D();
        var tailCurrentY = 0;

        while (currentCircleDiameter > 0) {
            this.drawBodyCircle(tail.tailGeometricObject, currentCircleDiameter, currentCircleDiameter, 0, tailCurrentY - currentCircleDiameter/2, 0);
            currentCircleDiameter -= 5;
            tailCurrentY -= currentCircleDiameter/2;
        }

        var geometry = new THREE.Geometry();
        var v1 = new THREE.Vector3(0,0,0);   // Vector3 used to specify position
        var v2 = new THREE.Vector3(300,0,0);
        var v3 = new THREE.Vector3(0,300,0);   // 2d = all vertices in the same plane.. z = 0
        geometry.vertices.push(v1);
        geometry.vertices.push(v2);
        geometry.vertices.push(v3);

        geometry.faces.push(new THREE.Face3(0, 2, 1));

        var redMat = new THREE.MeshBasicMaterial({color: 0xff0000});
        var triangle = new THREE.Mesh(geometry, redMat);

        //selfSettings.anatomy.body.bodyGeometricObject.add(tail.tailGeometricObject);
//            selfSettings.anatomy.body.bodyGeometricObject.add(triangle);
        scene.add(triangle);
//            selfSettings.anatomy.body.bodyGeometricObject.add(v1);
//            selfSettings.anatomy.body.bodyGeometricObject.add(v2);
//            selfSettings.anatomy.body.bodyGeometricObject.add(v3);
//            tail.tailGeometricObject.position.y = -300;
    }
};


grampus.init();