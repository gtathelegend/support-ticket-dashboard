/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        // SupportDesk design tokens
        brand: {
          primary: '#0C66E4',
          hover: '#0055CC',
        },
        surface: {
          page: '#F7F8FA',
          card: '#FFFFFF',
          input: '#FFFFFF',
          muted: '#F7F8FA',
        },
        border: {
          DEFAULT: '#DFE1E6',
          strong: '#C1C7D0',
        },
        text: {
          primary: '#172B4D',
          secondary: '#5E6C84',
          muted: '#7A869A',
          inverse: '#FFFFFF',
        },
        status: {
          open: {
            bg: '#E9F2FF',
            text: '#0C66E4',
            border: '#CCE0FF',
          },
          inprogress: {
            bg: '#FFF7D6',
            text: '#974F0C',
            border: '#F5CD47',
          },
          resolved: {
            bg: '#DFFCF0',
            text: '#216E4A',
            border: '#ABF5D1',
          },
        },
        priority: {
          high: {
            bg: '#FFECEB',
            text: '#AE2A19',
            border: '#FFC3BE',
          },
          medium: {
            bg: '#FFF7D6',
            text: '#974F0C',
            border: '#F5CD47',
          },
          low: {
            bg: '#F1F2F4',
            text: '#44546F',
            border: '#C1C7D0',
          },
        },
        danger: {
          bg: '#FFECEB',
          text: '#AE2A19',
          border: '#FFC3BE',
        },
        success: {
          bg: '#DFFCF0',
          text: '#216E4A',
          border: '#ABF5D1',
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(9, 30, 66, 0.08)',
        modal: '0 8px 32px rgba(9, 30, 66, 0.15), 0 0 0 1px rgba(9, 30, 66, 0.06)',
        'sm-border': '0 1px 3px rgba(9, 30, 66, 0.08)',
      },
      borderRadius: {
        control: '4px',
        card: '6px',
        modal: '8px',
      },
    },
  },
  plugins: [],
};
