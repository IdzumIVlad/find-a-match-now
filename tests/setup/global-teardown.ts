import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('Cleaning up global test environment...');
  
  // You can add global cleanup here, such as:
  // - Cleaning test database
  // - Removing test files
  // - Closing external services
  
  console.log('Global teardown completed');
}

export default globalTeardown;