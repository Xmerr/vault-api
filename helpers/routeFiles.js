const { readdirSync } = require('fs');
const path = require('path');
const ignores = ['index.js'];

const routeDirectory = path.resolve(__dirname, '..', 'routes');
const routeFiles = readdirSync(routeDirectory).filter(name => !ignores.includes(name));

module.exports = routeFiles;
