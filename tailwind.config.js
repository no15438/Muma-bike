/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A6F8A', // 深蓝灰色，可以作为主色调
        secondary: '#78A5A3', // 青绿色，作为辅助色
        accent: '#E1B16A', // 暖黄色，作为强调色
        dark: '#444444', // 深灰色，用于文字
        light: '#F9F9F9', // 浅灰色，用于背景
        danger: '#d9534f', // 红色，用于错误或警告
        success: '#5cb85c', // 绿色，用于成功提示
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
        heading: ['Montserrat', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'nav': '0 2px 4px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
} 