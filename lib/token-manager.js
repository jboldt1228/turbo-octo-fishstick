import inquirer from 'inquirer';
import Conf from 'conf';
import chalk from 'chalk';

const config = new Conf({
  projectName: 'turbo-octo-fishstick',
  encryptionKey: 'turbo-octo-fishstick-encryption-key'
});

/**
 * Validates Claude API token format
 * @param {string} token - The token to validate
 * @returns {boolean|string} - True if valid, error message if invalid
 */
function validateToken(token) {
  if (!token || token.trim() === '') {
    return 'Token cannot be empty';
  }

  // Claude API tokens typically start with 'sk-ant-'
  if (!token.startsWith('sk-ant-')) {
    return 'Invalid token format. Claude API tokens should start with "sk-ant-"';
  }

  if (token.length < 20) {
    return 'Token appears to be too short';
  }

  return true;
}

/**
 * Interactive setup for Claude API token
 */
export async function setupToken() {
  console.log(chalk.blue.bold('\n🔧 Claude API Token Setup\n'));

  const currentToken = config.get('apiToken');

  if (currentToken) {
    console.log(chalk.yellow('⚠️  A token is already configured.'));
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'Do you want to overwrite the existing token?',
        default: false
      }
    ]);

    if (!overwrite) {
      console.log(chalk.green('\n✓ Keeping existing token.\n'));
      return;
    }
  }

  console.log(chalk.gray('Get your API token from: https://console.anthropic.com/settings/keys\n'));

  const answers = await inquirer.prompt([
    {
      type: 'password',
      name: 'token',
      message: 'Enter your Claude API token:',
      mask: '*',
      validate: validateToken
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Save this token?',
      default: true
    }
  ]);

  if (!answers.confirm) {
    console.log(chalk.yellow('\n✗ Token not saved.\n'));
    return;
  }

  try {
    config.set('apiToken', answers.token);
    console.log(chalk.green.bold('\n✓ Token successfully saved!\n'));
    console.log(chalk.gray(`Token stored at: ${config.path}\n`));
  } catch (error) {
    console.error(chalk.red('\n✗ Error saving token:'), error.message);
    throw error;
  }
}

/**
 * Retrieves the stored API token
 * @returns {string|null} - The stored token or null if not found
 */
export function getToken() {
  return config.get('apiToken');
}

/**
 * Removes the stored API token
 */
export function clearToken() {
  config.delete('apiToken');
  console.log(chalk.green('\n✓ Token cleared successfully.\n'));
}

/**
 * Checks if a token is configured
 * @returns {boolean} - True if token exists
 */
export function hasToken() {
  return config.has('apiToken');
}
