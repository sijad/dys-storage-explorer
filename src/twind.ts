import { install, defineConfig, injectGlobal } from "@twind/core";
import presetAutoprefix from "@twind/preset-autoprefix";
import presetTailwind from "@twind/preset-tailwind/base";

import {
  indigoDark as brand,
  slateDark as gray,
} from "@twind/preset-radix-ui/colors";

const config = defineConfig({
  presets: [
    presetAutoprefix(),
    presetTailwind({
      colors: {
        brand,
        gray,
        white: "white",
      },
    }),
  ],
});

install(config);

injectGlobal`
  body, html {
    @apply bg-brand-1 text-gray-11;
  }

  body {
    font-family: 'Montserrat', sans-serif;
  }
`;
