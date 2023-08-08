/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/flowbite/**/*.js",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
            colors: {
                // Default dark fitness-related theme
                background: "#feffff",
                "primary-dark": "#2c3531",
                primary: "#176e70",
                text: "#070707",
                //accent: "#ffcb9a",
                accent: "#d1ac75",
                //"accent-muted": "#d5ac88",
                "accent-muted": "#bda888",
                "accent-light": "#d1e8e2",
                abort: "#f1634f",
                "abort-muted": "#e14135",
            },
            animation: {
                "spin-slow": "spin 1.5s linear infinite",
                "ping-once": "ping 1.5s linear",
            },
        },
    },
    plugins: [require("daisyui"), require("flowbite/plugin")],
};
