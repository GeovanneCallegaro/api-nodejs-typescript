import { SetupServer } from '@src/server';
import supertest from 'supertest';
import { SuperTest, Test } from 'supertest';

declare global {
  // eslint-disable-next-line no-var
  var testRequest: SuperTest<Test>;
}

beforeAll(() => {
  const server = new SetupServer();
  server.init();
  global.testRequest = supertest(server.getApp());
});
