import dotenv from 'dotenv';

dotenv.config();

export const testConfig = {
  timeouts: {
    implicit: parseInt(process.env.IMPLICIT_WAIT || '10000'),
    explicit: parseInt(process.env.EXPLICIT_WAIT || '20000'),
    page: parseInt(process.env.PAGE_LOAD_TIMEOUT || '30000')
  },

  retries: {
    maxRetries: 2,
    retryInterval: 1000
  },

  screenshots: {
    onError: true,
    path: './screenshots/'
  },

  testData: {
    users: {
      testUser: {
        email: process.env.TEST_USER_EMAIL || 'testuser@gmail.com',
        password: process.env.TEST_USER_PASSWORD || 'password1'
      }
    }
  }
};

export default testConfig;

