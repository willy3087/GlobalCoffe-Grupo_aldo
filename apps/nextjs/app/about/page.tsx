'use client';

import React from 'react';
import Link from 'next/link';

export default function About() {
    return (
        <main className="min-h-screen p-6 animate-fade-in">
            <div className="max-w-4xl mx-auto">
                <div className="card p-8 mb-6 animate-slide-up">
                    <h1 className="text-4xl font-bold mb-6 gradient-primary bg-clip-text text-transparent">
                        Sobre o Global Coffee
                    </h1>
                    <p className="text-lg text-muted-foreground mb-6">
                        Uma aplicação moderna para gestão e visualização de documentos relacionados ao café global.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="card p-6 card-hover bg-card/50">
                            <h2 className="text-xl font-semibold mb-3 text-primary">Recursos Principais</h2>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                                    Visualização em árvore de documentos
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                                    Interface moderna com tema escuro
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                                    Busca inteligente de arquivos
                                </li>
                            </ul>
                        </div>
                        <div className="card p-6 card-hover bg-card/50">
                            <h2 className="text-xl font-semibold mb-3 text-primary">Tecnologias</h2>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                                    Next.js 15 com App Router
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                                    TypeScript para type safety
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                                    Tailwind CSS para estilização
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <nav className="flex justify-center">
                    <Link href="/" className="btn btn-primary">
                        Voltar para Home
                    </Link>
                </nav>
            </div>
        </main>
    );
}
