const path = require('path');
const routeFiles = require('../helpers/routeFiles');

module.exports = app => {
    routeFiles.forEach(name => {
        app.use(require(path.resolve(__dirname, name)).routes());
    });

    return app;
};
