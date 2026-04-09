const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RFP Demo Node API',
      version: '1.0.0',
      description: 'API documentation for RFP Demo Node',
    },
    servers: [
      {
        url: 'https://rfp-api-service-c8adb8a8h2gmbcf8.canadacentral-01.azurewebsites.net',
      },
      {
        url: 'http://localhost:3000',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'API key for MCP server integration',
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

// Write to swagger.json
fs.writeFileSync(
  path.join(__dirname, 'swagger.json'),
  JSON.stringify(swaggerSpec, null, 2)
);

console.log('✅ swagger.json generated successfully!');

// Made with Bob
