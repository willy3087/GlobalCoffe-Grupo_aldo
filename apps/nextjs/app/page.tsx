'use client';

import React, { useEffect, useState, useMemo, useCallback, Suspense, lazy } from 'react';
import { Box, TextField, InputAdornment, IconButton, Paper, Typography, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

// Lazy load com React.lazy ao invés de next/dynamic
const TreeView = lazy(() => import('../components/TreeView'));
const DocumentCards = lazy(() => import('../components/DocumentCards'));
const DocumentViewer = lazy(() => import('../components/DocumentViewer'));

interface TreeNode {
    name: string;
    type: 'file' | 'directory';
    path?: string;
    children?: TreeNode[];
}

export default function Home() {
    const [treeData, setTreeData] = useState<TreeNode[]>([]);
    const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
    const [selectedFileContent, setSelectedFileContent] = useState<string>('');
    const [documentsFlat, setDocumentsFlat] = useState<{ name: string; path: string }[]>([]);
    const [leftTab, setLeftTab] = useState<'tree' | 'cards'>('tree');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');

    // Debounce do termo de busca
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        async function fetchTree() {
            setIsLoading(true);
            try {
                const res = await fetch('/api/documents');
                const data = await res.json();
                setTreeData(data);
                // Extrair arquivos para exibir em cards
                const files: { name: string; path: string }[] = [];
                function extractFiles(nodes: TreeNode[]) {
                    nodes.forEach((node) => {
                        if (node.type === 'file' && node.path) {
                            files.push({ name: node.name, path: node.path });
                        } else if (node.type === 'directory' && node.children) {
                            extractFiles(node.children);
                        }
                    });
                }
                extractFiles(data);
                setDocumentsFlat(files);
            } finally {
                setIsLoading(false);
            }
        }
        fetchTree();
    }, []);

    useEffect(() => {
        async function fetchContent() {
            if (selectedFilePath) {
                const res = await fetch(`/api/documents?path=${encodeURIComponent(selectedFilePath)}`);
                const data = await res.json();
                if (data.content) {
                    setSelectedFileContent(data.content);
                } else {
                    setSelectedFileContent('Erro ao carregar conteúdo do documento.');
                }
            } else {
                setSelectedFileContent('');
            }
        }
        fetchContent();
    }, [selectedFilePath]);

    // Filtrar documentos com base no termo de busca (usando debounced)
    const filteredDocuments = useMemo(() => {
        if (!debouncedSearchTerm.trim()) return documentsFlat;

        const searchLower = debouncedSearchTerm.toLowerCase();
        return documentsFlat.filter(doc =>
            doc.name.toLowerCase().includes(searchLower) ||
            doc.path.toLowerCase().includes(searchLower)
        );
    }, [documentsFlat, debouncedSearchTerm]);

    // Filtrar árvore de documentos
    const filteredTreeData = useMemo(() => {
        if (!debouncedSearchTerm.trim()) return treeData;

        function filterTree(nodes: TreeNode[]): TreeNode[] {
            return nodes.reduce((acc: TreeNode[], node) => {
                if (node.type === 'file') {
                    // Se é um arquivo, verifica se corresponde à busca
                    const searchLower = debouncedSearchTerm.toLowerCase();
                    if (node.name.toLowerCase().includes(searchLower) ||
                        (node.path && node.path.toLowerCase().includes(searchLower))) {
                        acc.push(node);
                    }
                } else if (node.type === 'directory' && node.children) {
                    // Se é um diretório, filtra recursivamente os filhos
                    const filteredChildren = filterTree(node.children);
                    if (filteredChildren.length > 0) {
                        acc.push({
                            ...node,
                            children: filteredChildren
                        });
                    }
                }
                return acc;
            }, []);
        }

        return filterTree(treeData);
    }, [treeData, debouncedSearchTerm]);

    const handleCardSelect = useCallback((path: string) => {
        setSelectedFilePath(path);
        setIsModalOpen(true);
    }, []);

    const clearSearch = useCallback(() => {
        setSearchTerm('');
    }, []);
    
    const handleFileSelect = useCallback((path: string) => {
        setSelectedFilePath(path);
    }, []);

    return (
        <>
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
                {/* Campo de busca no topo centralizado */}
                <Paper elevation={1} sx={{ p: 3, width: '100%', maxWidth: '800px', mx: 'auto' }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Buscar documentos por nome ou caminho..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={clearSearch}
                                        edge="end"
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    {searchTerm && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                            {leftTab === 'tree'
                                ? `Mostrando resultados filtrados para "${searchTerm}"`
                                : `${filteredDocuments.length} documento${filteredDocuments.length !== 1 ? 's' : ''} encontrado${filteredDocuments.length !== 1 ? 's' : ''} para "${searchTerm}"`
                            }
                        </Typography>
                    )}
                </Paper>

                <Box sx={{ display: 'flex', gap: 2, flex: 1, height: 'calc(100vh - 200px)' }}>
                    {/* Painel esquerdo - Árvore de pastas */}
                    <Paper 
                        elevation={1} 
                        sx={{ 
                            width: '300px', 
                            overflow: 'auto',
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                            <button
                                style={{
                                    padding: '8px 16px',
                                    fontWeight: 600,
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    borderBottom: leftTab === 'tree' ? '2px solid #8B4513' : 'none',
                                    color: leftTab === 'tree' ? '#8B4513' : '#666'
                                }}
                                onClick={() => setLeftTab('tree')}
                            >
                                Árvore
                            </button>
                            <button
                                style={{
                                    padding: '8px 16px',
                                    fontWeight: 600,
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    borderBottom: leftTab === 'cards' ? '2px solid #8B4513' : 'none',
                                    color: leftTab === 'cards' ? '#8B4513' : '#666'
                                }}
                                onClick={() => setLeftTab('cards')}
                            >
                                Cards
                            </button>
                        </Box>
                        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                            {isLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                    <CircularProgress size={24} />
                                </Box>
                            ) : (
                                <Suspense fallback={<CircularProgress size={24} />}>
                                    {leftTab === 'tree' ? (
                                        <TreeView treeData={filteredTreeData} onSelectFile={handleFileSelect} />
                                    ) : (
                                        <DocumentCards documents={filteredDocuments} onSelect={handleCardSelect} />
                                    )}
                                </Suspense>
                            )}
                        </Box>
                    </Paper>

                    {/* Painel direito - Visualizador */}
                    <Paper 
                        elevation={1} 
                        sx={{ 
                            flex: 1, 
                            overflow: 'auto',
                            p: 3
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 2 }}>Visualizador</Typography>
                        <Suspense fallback={<CircularProgress size={24} />}>
                            {!isModalOpen ? (
                                selectedFilePath ? (
                                    <DocumentViewer content={selectedFileContent} />
                                ) : (
                                    <Typography color="text.secondary">Selecione um documento para visualizar seu conteúdo.</Typography>
                                )
                            ) : (
                                <Typography color="text.secondary">Visualizador aberto em modal.</Typography>
                            )}
                        </Suspense>
                    </Paper>
                </Box>
            </Box>

            {isModalOpen && (
                <Box
                    sx={{
                        position: 'fixed',
                        inset: 0,
                        bgcolor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1300
                    }}
                    onClick={() => setIsModalOpen(false)}
                >
                    <Paper
                        elevation={24}
                        sx={{
                            p: 4,
                            maxWidth: '90vw',
                            maxHeight: '80vh',
                            overflow: 'auto'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="mb-4 btn bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Fechar
                        </button>
                        <Suspense fallback={<CircularProgress size={24} />}>
                            <DocumentViewer content={selectedFileContent} />
                        </Suspense>
                    </Paper>
                </Box>
            )}
        </>
    );
}
