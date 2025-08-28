import React from 'react';
import NavBar from '../components/NavBar';
import '../styles/globals-minimal.css';
import ThemeRegistry from './ThemeRegistry';

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
        <html lang="pt-BR">
            <body>
                <ThemeRegistry>
                    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                        <NavBar />
                        <main style={{ flexGrow: 1, maxWidth: '1280px', margin: '0 auto', padding: '16px', width: '100%' }}>
                            {children}
                        </main>
                        <footer style={{ 
                            backgroundColor: 'rgba(30, 30, 30, 0.5)', 
                            textAlign: 'center', 
                            padding: '24px', 
                            borderTop: '1px solid #333',
                            marginTop: 'auto'
                        }}>
                            <p style={{ fontSize: '14px', color: '#999' }}>© 2025 Global Coffee</p>
                        </footer>
                    </div>
                </ThemeRegistry>
            </body>
        </html>
    );
}
