import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar/Navbar";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider session={pageProps.session}>
            <ChakraProvider>
                <Navbar />
                <Component {...pageProps} />
            </ChakraProvider>
        </SessionProvider>
    );
}
