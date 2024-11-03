export default [
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path: [
            'textures/environmentMap/px.png',
            'textures/environmentMap/nx.png',
            'textures/environmentMap/py.png',
            'textures/environmentMap/ny.png',
            'textures/environmentMap/pz.png',
            'textures/environmentMap/nz.png'
        ]
    },
    {
        name: 'environmentMapHDRTexture',
        type: 'equiRectangularTexture',
        path: 'textures/night.hdr',
    },
    {
        name: 'grassColorTexture',
        type: 'texture',
        path: 'textures/dirt/color.jpg'
    },
    {
        name: 'grassNormalTexture',
        type: 'texture',
        path: 'textures/dirt/normal.png'
    },
    {
        name: 'grassARMTexture',
        type: 'texture',
        path: 'textures/dirt/arm.jpg'
    },
    {
        name: 'grassDisplacementTexture',
        type: 'texture',
        path: 'textures/dirt/displacement.jpg'
    },
    {
        name: 'goblinModel',
        type: 'gltf',
        path: 'models/goblin.glb'
    },
    {
        name: 'foxModel',
        type: 'gltf',
        path: 'models/Fox/glTF-Binary/Fox.glb'
    }
]