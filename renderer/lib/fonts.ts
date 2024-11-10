import localFont from 'next/font/local';

export const myFont = localFont({
    src: [
      {
        path: '../public/fonts/ginto.woff', // Path to your WOFF file
        weight: '400', // Normal weight
        style: 'normal', // Normal style
      },
    ],
    variable: '--my-custom-font', // CSS variable for use in styles
  });