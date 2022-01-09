const app = require('./');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

app.listen(3333);