module.exports = {
    extension: ['ts'],
    spec: ['test/**/*.spec.ts'],
    recursive: true,
    'node-option': [
        'loader=ts-node/esm'
    ],
    require: [
        'ts-node/register'
    ]
};