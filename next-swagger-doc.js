module.exports = {
  apiFolder: 'app/api',
  schemaFolders: [],
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Coopagua API Documentation',
      version: '1.0.0',
      description:
        'API for managing the Coopagua system, including users, billing, and technical services.',
    },
    // All paths are defined here
    paths: {
      '/api/admin/users': {
        get: {
          summary: 'Get all users',
          description: 'Retrieves a list of all users in the system.',
          tags: ['Users'],
          responses: {
            '200': {
              description: 'A list of users.',
              content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } },
            },
            '403': { description: 'Unauthorized.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
        post: {
          summary: 'Create a new user',
          description: 'Creates a new user with the provided details.',
          tags: ['Users'],
          requestBody: {
            description: 'The user data to create.',
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserInput' },
              },
            },
          },
          responses: {
            '201': { description: 'User created successfully.', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
            '400': { description: 'Invalid input.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '403': { description: 'Unauthorized.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '409': { description: 'User with this email or document already exists.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/admin/users/{id}': {
        get: {
          summary: 'Get a single user by ID',
          description: 'Retrieves the full details of a specific user.',
          tags: ['Users'],
          parameters: [{ $ref: '#/components/parameters/UserId' }],
          responses: {
            '200': { description: "The user's details.", content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
            '403': { description: 'Unauthorized.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '404': { description: 'User not found.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
        patch: {
          summary: 'Update a user',
          description: 'Updates the details of an existing user.',
          tags: ['Users'],
          parameters: [{ $ref: '#/components/parameters/UserId' }],
          requestBody: {
            description: 'User data to update. Only fields to be changed need to be sent.',
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserInput' },
              },
            },
          },
          responses: {
            '200': { description: 'User updated successfully.', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
            '400': { description: 'Invalid input.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '403': { description: 'Unauthorized.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '404': { description: 'User not found.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
        delete: {
          summary: 'Delete a user',
          description: 'Deletes a user from the system.',
          tags: ['Users'],
          parameters: [{ $ref: '#/components/parameters/UserId' }],
          responses: {
            '204': { description: 'User deleted successfully.' },
            '403': { description: 'Unauthorized.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            '404': { description: 'User not found.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/user': {
        get: {
          summary: 'Get current user',
          description: 'Retrieves the details of the currently authenticated user.',
          tags: ['Users'],
          responses: {
            '200': { description: 'Current user details.', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
            '401': { description: 'Unauthorized, no active session.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/mercadopago/webhook': {
        post: {
          summary: 'Mercado Pago Webhook',
          description: 'Receives webhook notifications from Mercado Pago for payment events.',
          tags: ['Payments'],
          requestBody: {
            description: 'Webhook payload from Mercado Pago.',
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  example: { type: 'payment', 'data.id': '123456789' },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Webhook received successfully.' },
            '400': { description: 'Invalid payload.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
    },
    // All reusable components are defined here
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      parameters: {
        UserId: {
          in: 'path',
          name: 'id',
          required: true,
          description: 'Numeric ID of the user.',
          schema: { type: 'integer' },
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
            role: { type: 'string', enum: ['socio', 'admin', 'tecnico', 'superadmin'], example: 'socio' },
            status: { type: 'string', enum: ['activo', 'moroso', 'suspendido'], example: 'activo' },
            phone: { type: 'string', example: '123-456-7890' },
            membershipNumber: { type: 'string', example: 'A-123' },
            dni: { type: 'string', example: '12345678' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        UserInput: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
            password: { type: 'string', format: 'password', description: 'Required for new users with login.' },
            role: { type: 'string', enum: ['socio', 'admin', 'tecnico'], example: 'socio' },
            status: { type: 'string', enum: ['activo', 'baja'], example: 'activo' },
            phone: { type: 'string', example: '123-456-7890' },
            membershipNumber: { type: 'string', example: 'A-123' },
            dni: { type: 'string', example: '12345678' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', description: 'A description of the error.' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
};
