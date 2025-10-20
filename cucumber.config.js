import dotenv from 'dotenv';
import { buildCapabilities, getRemoteConfig } from './config/capabilities.helper.js';

dotenv.config();

/**
 * Cucumber Configuration
 * Supports both local and remote execution modes
 */

const isRemote = process.env.EXECUTION_MODE?.toLowerCase() === 'remote';
const remoteConfig = getRemoteConfig();

export default {
  // Feature files location
  features: ['features/**/*.feature'],
  // features: ['features/**/login.feature'],

  // Step definitions location
  stepDefinitions: ['features/step_definitions/**/*.js'],

  // Support files (hooks, etc.)
  require: ['features/support/**/*.js'],

  // Format options
  format: [
    'progress-bar',
    'html:test-results/cucumber-report.html',
    'json:test-results/cucumber-report.json',
    '@cucumber/pretty-formatter'
  ],

  // Parallel execution
  parallel: parseInt(process.env.MAX_INSTANCES || '1'),

  // Retry failed scenarios
  retry: 0,

  // Fail fast option
  failFast: false,

  // Strict mode
  strict: true,

  // Dry run
  dryRun: false,

  // Publish quiet
  publishQuiet: true,

  // Default timeout for steps (10 seconds)
  timeout: 10000,

  // World parameters (passed to step definitions)
  worldParameters: {
    appiumConfig: remoteConfig,
    capabilities: buildCapabilities(),
    isRemoteExecution: isRemote,
    executionMode: isRemote ? 'remote' : 'local'
  }
};
