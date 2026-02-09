import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const theme = create({
  base: 'light',
  brandTitle: '<img style="margin-right: 10px;" src="./favicon.svg" alt="Plugin UI"> Plugin UI Storybook',
  // brandImage: './favicon.svg',
});

addons.setConfig({
  theme,
});
