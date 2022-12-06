import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss';

export default defineConfig({
  shortcuts: [
    [
      'btn',
      'px-4 py-1 rounded inline-block bg-teal-700 text-white cursor-pointer hover:bg-teal-800 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'
    ],
    [
      'icon-btn',
      'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'
    ],
    ['error-message', 'text-red-600 text-xs m-1.2'],
    ['flex-center-row', 'flex flex-row justify-center items-center'],
    ['flex-center-column', 'flex flex-col justify-center items-center '],
    [
      'class-icons',
      'flex items-center text-.75em justify-center gap-2 font-600'
    ],
    [
      'profile-div-rows',
      'flex items-center justify-between bg-white rounded-lg w-full p-3 text-xs font-600'
    ]
  ],
  theme: {
    colors: {
      accent: '#70A2D7',
      primary: '#6969AF',
      secondary: '#FE7A59',
      blueish: '#2AA296'
    }
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 2,
      warn: true
    }),
    presetTypography()
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  safelist: 'prose prose-sm m-auto text-left'.split(' ')
});
