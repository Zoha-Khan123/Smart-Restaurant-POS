import { beforeAll, beforeEach } from 'vitest';
import { patchMongooseForTests, memoryStore } from './inMemoryDb.js';

beforeAll(async () => {
  patchMongooseForTests();
});

beforeEach(async () => {
  memoryStore.clear();
});
