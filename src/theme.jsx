import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
    colors: {
        primary: {
            50: '#FFFEF0',
            100: '#FFFACC',
            200: '#FFF599',
            300: '#FFEF66',
            400: '#FFE933',
            500: '#FDE80B', // Brand Yellow
            600: '#E0CE05',
            700: '#B8A804',
            800: '#8F8203',
            900: '#665C02',
        },
        brand: {
            dark: '#0A1926', // Brand Dark Navy
            light: '#FFFDF5',
        },
    },
    fonts: {
        heading: `'Inter', sans-serif`,
        body: `'Inter', sans-serif`,
        cursive: `'Dancing Script', cursive`,
    },
    styles: {
        global: (props) => ({
            body: {
                bg: props.colorMode === 'dark' ? 'brand.dark' : 'brand.light',
                color: props.colorMode === 'dark' ? 'gray.100' : 'brand.dark',
            },
        }),
    },
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false,
    },
})

export default theme