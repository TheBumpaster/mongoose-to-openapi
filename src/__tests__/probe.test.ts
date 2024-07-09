import { PathsObject } from 'openapi3-ts/oas31';
import createOpenAPIFactory from '../index'; // Adjust the import path as necessary
import { Schema } from 'mongoose';

// Mock necessary parts
jest.mock('glob', () => ({
	sync: jest.fn()
}));

jest.mock('path', () => ({
    ...jest.requireActual('path'),
    resolve: jest.fn().mockImplementation((path) => path),
    basename: jest.fn().mockImplementation((path) => path.split('/').pop().split('.')[0]),
    extname: jest.fn().mockImplementation((path) => '.js')
}));

describe('OpenAPIFactory', () => {
    const mockInfo = { title: 'Test API', version: '1.0.0' };
    const schemaPattern = './__tests__/schemas/user.ts';

    beforeAll(() => {
		const glob = require('glob');
        glob.sync.mockImplementation(() => ['./__tests__/schemas/user.ts']);
    });

    describe('Initialization and Schema Loading', () => {
        it('should initialize and load schemas correctly', () => {
            const factory = createOpenAPIFactory({ info: mockInfo, schemaPattern });
            factory.init();
            const openAPI = factory.getOpenAPI();

            expect(openAPI.components?.schemas?.user).toBeDefined();
            expect(openAPI.components?.schemas?.user).toEqual({
				properties: {
					_id: {
						type: "string"
					}, 
					age: {
						type: "number"
					}, 
					name: {
						type: "string"
					}
				},
				required: ["name"],
				type: "object"
			});
        });
    });

    describe('Route Handling', () => {
        it('should add a single route correctly', () => {
            const factory = createOpenAPIFactory({ info: mockInfo, schemaPattern });
            factory.init();
            factory.addRoute('/users', 'get', { summary: 'Get all users' });

            const openAPI = factory.getOpenAPI();
			expect(openAPI.paths).toBeDefined();
            expect((openAPI.paths as PathsObject)['/users'].get).toBeDefined();
            expect((openAPI.paths as PathsObject)['/users'].get?.summary).toBe('Get all users');
        });

        it('should handle multiple routes addition', () => {
            const factory = createOpenAPIFactory({ info: mockInfo, schemaPattern });
            factory.init();
            factory.addRoutes({
                '/users': {
                    get: { summary: 'Get all users' },
                    post: { summary: 'Create a user' }
                }
            });

            const openAPI = factory.getOpenAPI();
            expect((openAPI.paths as PathsObject)['/users'].get?.summary).toBe('Get all users');
            expect((openAPI.paths as PathsObject)['/users'].post?.summary).toBe('Create a user');
        });
    });
});
