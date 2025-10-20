# Mobile Test Automation Framework

A robust test automation framework for mobile applications using Appium, WebdriverIO, and Mocha/Cucumber.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Android SDK
- Appium

### Setup (5 minutes)
```bash
# 1. Install dependencies
npm install

# 2. Setup Android SDK
./scripts/setup-android-sdk.sh
# Restart your terminal after this!

# 3. Install Appium driver
appium driver install uiautomator2@2.34.1

# 4. Start emulator
./scripts/start-emulator.sh

# 5. Run tests
appium  # Terminal 1
npm run test:bdd:smoke  # Terminal 2
```

**Full guide:** [docs/QUICK_START.md](docs/QUICK_START.md)

---

## 📁 Project Structure

```
elitea-mobitru-demo/
├── features/                    # BDD Feature files
│   ├── *.feature               # Gherkin scenarios
│   ├── step_definitions/       # Step implementations
│   └── support/                # Cucumber hooks
├── test/
│   ├── pages/                  # Page Object Models
│   ├── specs/                  # Mocha test specs
│   ├── helpers/                # Reusable helpers
│   └── data/                   # Test data
├── config/                     # Configuration files
│   ├── appium.config.js        # Appium capabilities
│   ├── capability-profiles.js  # Environment profiles
│   └── test.config.js          # Test settings
├── utils/                      # Utility functions
│   ├── driver.js               # Driver management
│   └── logger.js               # Winston logger
├── scripts/                    # 🆕 Setup & utility scripts
│   ├── setup-android-sdk.sh    # Android SDK setup
│   ├── start-emulator.sh       # Start Android emulator
│   ├── fix-adb-connection.sh   # Fix ADB issues
│   ├── fix-driver-issue.sh     # Fix Appium driver
│   ├── create-emulator.sh      # Create new emulator
│   ├── fix-node-version.sh     # Fix Node.js version
│   ├── setup-appium.sh         # Setup Appium
│   └── verify-setup.sh         # Verify complete setup
├── docs/                       # 🆕 Documentation
│   ├── QUICK_START.md          # 5-minute quick start
│   ├── BDD_GUIDE.md            # BDD/Cucumber guide
│   ├── CAPABILITIES.md         # Capability configuration
│   ├── CAPABILITY_GUIDE.md     # Detailed capability guide
│   ├── EMULATOR_GUIDE.md       # Android emulator guide
│   ├── SETUP_GUIDE.md          # Complete setup guide
│   └── troubleshooting/        # Troubleshooting guides
│       ├── ANDROID_SDK_FIX.md  # Android SDK issues
│       ├── APPIUM_FIX.md       # Appium driver issues
│       ├── ADB_CONNECTION_FIX.md # ADB connection issues
│       ├── HOW_TO_RUN.md       # Complete running guide
│       ├── BDD_CONVERSION_SUMMARY.md
│       └── FINAL_SUMMARY.md
├── .env                        # Environment configuration
├── cucumber.config.js          # Cucumber settings
├── package.json                # Dependencies & scripts
└── README.md                   # This file
```

---

## 📚 Documentation

### Getting Started
- **[Quick Start](docs/QUICK_START.md)** - Get running in 5 minutes
- **[Setup Guide](docs/SETUP_GUIDE.md)** - Complete installation guide
- **[Emulator Guide](docs/EMULATOR_GUIDE.md)** - Using Android emulators

### Framework Guides
- **[BDD Guide](docs/BDD_GUIDE.md)** - Writing BDD tests with Cucumber
- **[Capabilities Guide](docs/CAPABILITIES.md)** - Configuring device capabilities
- **[Quick Reference](BDD_QUICK_REFERENCE.md)** - Command cheat sheet

### Troubleshooting
- **[How to Run](docs/troubleshooting/HOW_TO_RUN.md)** - Complete running guide with all fixes
- **[Android SDK Fix](docs/troubleshooting/ANDROID_SDK_FIX.md)** - Environment variable issues
- **[Appium Driver Fix](docs/troubleshooting/APPIUM_FIX.md)** - Driver installation issues
- **[ADB Connection Fix](docs/troubleshooting/ADB_CONNECTION_FIX.md)** - Device connection issues
- **[BDD Conversion Summary](docs/troubleshooting/BDD_CONVERSION_SUMMARY.md)** - Project conversion details

---

## 🛠️ Utility Scripts

All scripts are located in the `scripts/` directory:

### Setup Scripts
```bash
./scripts/setup-android-sdk.sh    # Setup Android SDK environment
./scripts/setup-appium.sh          # Install/upgrade Appium
./scripts/verify-setup.sh          # Verify complete setup
```

### Emulator Scripts
```bash
./scripts/start-emulator.sh        # Start Android emulator
./scripts/create-emulator.sh       # Create new emulator
```

### Fix Scripts
```bash
./scripts/fix-adb-connection.sh    # Fix device connection
./scripts/fix-driver-issue.sh      # Fix Appium driver
./scripts/fix-node-version.sh      # Fix Node.js version
```

---

## Features

✅ **Page Object Model (POM)** - Clean separation of test logic and page elements  
✅ **BDD/Cucumber Support** - Write tests in natural language ✨ NEW  
✅ **Flexible Capability Management** - Easy configuration via .env or programmatic  
✅ **Multiple Test Runners** - Mocha for traditional tests, Cucumber for BDD  
✅ **Multiple Capability Profiles** - Dev, staging, production, CI/CD profiles  
✅ **Environment Variables** - Secure configuration management  
✅ **Helper Functions** - Reusable utilities for common actions  
✅ **Comprehensive Logging** - Winston logger for debugging  
✅ **Error Handling** - Robust error handling with screenshots  
✅ **Code Quality** - ESLint for code standards  
✅ **Chai Assertions** - Readable test assertions

## Setup

### 1. Install dependencies:
```bash
npm install
```

### 2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your device and app configuration
```

Example `.env` configuration:
```dotenv
# Appium Server
APPIUM_HOST=localhost
APPIUM_PORT=4723

# Device Configuration
PLATFORM_NAME=Android
DEVICE_NAME=emulator-5554
UDID=R58NB36PGNW

# App Configuration
AUTOMATION_NAME=UiAutomator2
APP_PACKAGE=com.epam.mobitru
APP_ACTIVITY=.MainActivity
NO_RESET=false
KEEP_DEVICE=true

# Test Credentials
TEST_USER_EMAIL=testuser@gmail.com
TEST_USER_PASSWORD=password1
```

### 3. Install Appium:
```bash
npm install -g appium
appium driver install uiautomator2
```

### 4. Start Appium server:
```bash
appium
```

## Running Tests

### Mocha Tests (Traditional)
```bash
# Run all Mocha tests
npm test

# Run specific test
npm test -- --grep "shopping flow"

# Run login tests
npm run test:login

# Run shopping tests
npm run test:shopping
```

### BDD/Cucumber Tests ✨ NEW
```bash
# Run all BDD tests
npm run test:bdd

# Run smoke tests only
npm run test:bdd:smoke

# Run E2E tests only
npm run test:bdd:e2e

# Run specific JIRA test case
npm run test:bdd:tags "@epmxyz-9099"

# Run tests by tags
npm run test:bdd:tags "@login"
npm run test:bdd:tags "@cart"
npm run test:bdd:tags "@smoke and @e2e"
```

### JIRA Test Cases ✨ NEW
The framework now includes automated test cases for specific JIRA tickets:

- **EPMXYZ-9099**: Complete shopping flow from login to checkout
  - Location: `features/epmxyz-9099-shopping-flow.feature`
  - Tags: `@epmxyz-9099 @e2e @smoke`
  - Covers: Login → Add Product → Cart → Checkout → Logout → App Close

### With Different Capabilities
```bash
# Run with specific profile
TEST_PROFILE=staging npm test
TEST_PROFILE=staging npm run test:bdd

# Run with custom device
UDID=MY_DEVICE npm test
UDID=MY_DEVICE npm run test:bdd
```

## Capability Configuration

This framework provides **multiple flexible ways** to configure Appium capabilities:

### Method 1: Environment Variables (Recommended)
Simply edit your `.env` file - perfect for most use cases:
```dotenv
PLATFORM_NAME=Android
UDID=R58NB36PGNW
APP_PACKAGE=com.epam.mobitru
APP_ACTIVITY=.MainActivity
```

### Method 2: Capability Profiles
Use predefined profiles for different environments:
```bash
TEST_PROFILE=dev npm test        # Development
TEST_PROFILE=staging npm test    # Staging
TEST_PROFILE=production npm test # Production
```

### Method 3: Programmatic Override
Override capabilities in your test code:
```javascript
import { buildCapabilities } from '../config/capabilities.helper.js';

const customCaps = buildCapabilities({
  'appium:udid': 'CUSTOM_DEVICE',
  'appium:noReset': true
});

await driverManager.initDriver(customCaps);
```

### Method 4: Command Line Override
Override specific values via environment:
```bash
UDID=NEW_DEVICE APP_PACKAGE=com.custom.app npm test
```

📖 **See [docs/CAPABILITIES.md](docs/CAPABILITIES.md) for complete capability configuration guide**

## Writing Tests

Tests follow the Page Object Model pattern. Here's an example:

```javascript
import LoginPage from '../pages/LoginPage';
import { expect } from 'chai';
import { users } from '../data/testData';

describe('Login Flow', () => {
  it('should login successfully', async () => {
    await LoginPage.login(users.validUser.email, users.validUser.password);
    const hasError = await LoginPage.isErrorDisplayed();
    expect(hasError).to.be.false;
  });
});
```

## Page Objects

All locators are centralized in Page Object classes:

```javascript
class LoginPage extends BasePage {
  constructor() {
    super();
    this.locators = {
      loginField: '//android.widget.EditText[1]',
      passwordField: '//android.widget.EditText[2]',
      signInButton: '//android.widget.Button[@text="Sign in"]'
    };
  }

  async login(email, password) {
    await this.enterLogin(email);
    await this.enterPassword(password);
    await this.clickSignIn();
  }
}
```

## Helper Utilities

### ElementHelper
Handles element interactions with retry logic:
```javascript
await ElementHelper.clickWithRetry(element);
await ElementHelper.setValueWithRetry(element, 'value');
await ElementHelper.waitForDisplayed(element);
```

### GestureHelper
Handles mobile gestures:
```javascript
await GestureHelper.swipe('up', 0.5);
await GestureHelper.longPress(element, 1000);
await GestureHelper.dragAndDrop(fromElement, toElement);
```

## Test Data Management

Test data is centralized in `test/data/testData.js`:
```javascript
export const users = {
  validUser: {
    email: 'testuser@gmail.com',
    password: 'password1'
  }
};
```

## Logging

The framework uses Winston for comprehensive logging:
- Console output for development
- File logging in `logs/` directory
- Automatic error logging
- Screenshot capture on failures

## Screenshots

Screenshots are automatically captured:
- On test failures
- On demand: `await page.takeScreenshot('screenshot-name')`
- Saved to `screenshots/` directory

## Best Practices Implemented

1. **Separation of Concerns** - Page objects separate locators from test logic
2. **DRY Principle** - Reusable helpers and base classes
3. **Configuration Management** - Environment-based configuration
4. **Error Handling** - Try-catch with meaningful error messages
5. **Retry Logic** - Automatic retries for flaky operations
6. **Explicit Waits** - Proper wait strategies instead of hard sleeps
7. **Logging** - Comprehensive logging for debugging
8. **Code Quality** - ESLint for consistent code style

## Project Scripts

```bash
# Mocha Tests
npm test              # Run all Mocha tests
npm run test:login    # Run login tests
npm run test:shopping # Run shopping tests

# BDD/Cucumber Tests ✨ NEW
npm run test:bdd        # Run all BDD tests
npm run test:bdd:smoke  # Run smoke tests
npm run test:bdd:e2e    # Run E2E tests
npm run test:bdd:tags   # Run tests by tags

# Code Quality
npm run lint      # Check code quality
npm run lint:fix  # Fix linting issues
```

## Troubleshooting

### Appium connection issues
- Ensure Appium server is running on the correct port
- Check APPIUM_HOST and APPIUM_PORT in .env

### Device not found
- Verify device is connected: `adb devices`
- Check UDID in .env matches your device

### Element not found
- Check locators in page objects
- Increase wait timeouts in test.config.js
- Take screenshots to debug

## Contributing

1. Follow the existing code structure
2. Add page objects for new screens
3. Write tests in `test/specs/`
4. Update documentation as needed
5. Run linting before committing

## Support

- For capability configuration help, see [docs/CAPABILITIES.md](docs/CAPABILITIES.md)
- For BDD/Cucumber guide, see [docs/BDD_GUIDE.md](docs/BDD_GUIDE.md) ✨ NEW
- For quick start, see [docs/QUICK_START.md](docs/QUICK_START.md)

## 🌐 Remote Execution on Mobitru Device Farm

### Quick Start

```bash
# 1. Configure .env for remote execution
EXECUTION_MODE=remote
DEVICE_FARM_BASE_URL=stage.mobitru.com
DEVICE_FARM_API_KEY=your_api_key
DEVICE_FARM_SLUG=epm-tstf
DEVICE_FARM_UDID=38210DLJH0023E

# 2. Run tests (no local Appium needed!)
npm run test:bdd:smoke
```

**Full guide:** [docs/REMOTE_EXECUTION.md](docs/REMOTE_EXECUTION.md)

### Authentication

The framework uses Basic Authentication with your Mobitru credentials:
- Format: `Basic base64(slug:apiKey)`
- Automatically encoded from `DEVICE_FARM_SLUG` and `DEVICE_FARM_API_KEY`

### Configuration

All remote settings via `.env`:
```dotenv
EXECUTION_MODE=remote
DEVICE_FARM_BASE_URL=stage.mobitru.com
DEVICE_FARM_API_KEY=XXXX
DEVICE_FARM_SLUG=epm-tstf
DEVICE_FARM_UDID=38210DLJH0023E
NODE_TLS_REJECT_UNAUTHORIZED=0
```

### Switching Modes

```bash
# Run remotely
EXECUTION_MODE=remote npm run test:bdd:smoke

# Run locally  
EXECUTION_MODE=local npm run test:bdd:smoke
```
