import { SetupServer } from '@src/server';
import supertest from 'supertest';
import { SuperTest, Test } from 'supertest';

declare global {
  // eslint-disable-next-line no-var
  var testRequest: SuperTest<Test>;
}

let server: SetupServer;
jest.setTimeout(30000);
beforeAll(async () => {
  server = new SetupServer();
  await server.init();
  global.testRequest = supertest(server.getApp());
});

afterAll(async () => {
  await server.close();
});
