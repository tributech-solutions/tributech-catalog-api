import { readFileSync } from 'fs';
import { join } from 'path';
import stripJsonComments from 'strip-json-comments';
import { SettingsModel } from './settings.model';

const CONFIG_FILENAME = 'settings/settings.json';
const DEV_CONFIG_FILENAME = 'settings/settings.dev.json';

export default () => {
  const settingsWithComments = readFileSync(
    join(process.cwd(), DEV_CONFIG_FILENAME),
    'utf8'
  );

  return JSON.parse(stripJsonComments(settingsWithComments)) as SettingsModel;
};
