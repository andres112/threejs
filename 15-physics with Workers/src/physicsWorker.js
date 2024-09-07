import * as CANNON from 'cannon-es'; // Use cannon-es, which is an ES module version of Cannon.js

// Physics world setup
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
const defaultMaterial = new CANNON.Material('default');
const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 1,
    restitution: 0.5
});
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

let bodies = [];
let lastTime;

// Function to create a box in the physics world
const createBox = (size, position, rotation) => {
    const shape = new CANNON.Box(new CANNON.Vec3(size * 0.5, size * 0.5, size * 0.5));
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(position.x, position.y, position.z),
        shape: shape,
    });
    body.quaternion.setFromEuler(rotation.x, rotation.y, rotation.z);
    world.addBody(body);

    bodies.push(body);
    return body;
};

const createFloor = () => {
    const shape = new CANNON.Plane();
    const body = new CANNON.Body();
    body.mass = 0;
    body.addShape(shape);
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
    world.addBody(body);
};

// Handle messages from the main thread
onmessage = (e) => {
    const { type, ...data } = e.data;

    if (type === 'createFloor') {
        createFloor();
    }

    if (type === 'createBox') {
        const boxBody = createBox(data.size, data.position, data.rotation);
        postMessage({ type: 'createBox', data: { ...data } });
    }

    if (type === 'reset') {
        bodies.forEach((body) => world.removeBody(body));
        bodies = [];
    }

    if (type === 'updatePhysics') {
        const now = performance.now();
        const deltaTime = lastTime ? (now - lastTime) / 1000 : 0;
        lastTime = now;

        // Step the physics world
        world.step(1 / 60, deltaTime, 3);

        // Send updated positions and rotations back to the main thread
        const positions = bodies.map((body) => ({
            position: body.position,
            rotation: body.quaternion,
        }));

        postMessage({ type: 'update', data: positions });
    }
};
