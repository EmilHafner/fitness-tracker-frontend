import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar/Navbar";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export default function App({ Component, pageProps }: AppProps) {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider session={pageProps.session}>
                <ChakraProvider>
                    <Navbar />
                    <Component {...pageProps} />
                </ChakraProvider>
            </SessionProvider>
        </QueryClientProvider>
    );
}
