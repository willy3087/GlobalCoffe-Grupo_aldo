import React from 'react';
import NavBar from '../components/NavBar';
import '../styles/globals.css';

export const metadata = {
    title: 'Aplicação Next.js',
    description: 'Aplicação Next.js com estrutura inicial e navegação básica',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR" className="dark">
            <body className="min-h-screen flex flex-col scrollbar-custom">
                <NavBar />
                <main className="flex-grow container mx-auto p-4 animate-fade-in">{children}</main>
                <footer className="bg-card/50 backdrop-blur-sm text-center p-6 border-t border-border mt-auto">
                    <p className="text-sm text-muted-foreground">© 2025 Global Coffee</p>
                </footer>
            </body>
        </html>
    );
}
