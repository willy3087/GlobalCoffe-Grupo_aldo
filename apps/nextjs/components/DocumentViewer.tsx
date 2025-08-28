import React, { useEffect, useState, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Paper, Typography, Box, Table, TableBody, TableCell, TableRow } from '@mui/material';

interface DocumentViewerProps {
    content: string;
    filePath?: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = memo(({ content, filePath }) => {
    const [fileType, setFileType] = useState<string>('text');

    useEffect(() => {
        // Detect file type by extension or content
        if (filePath) {
            const extension = filePath.split('.').pop()?.toLowerCase();
            if (extension === 'pdf') {
                setFileType('pdf');
            } else if (extension === 'docx' || extension === 'doc') {
                setFileType('docx');
            } else if (extension === 'xlsx' || extension === 'xls' || extension === 'csv') {
                setFileType('excel');
            } else if (extension === 'mmd' || content.includes('graph') || content.includes('flowchart')) {
                setFileType('mermaid');
            } else if (extension === 'md' || extension === 'markdown') {
                setFileType('markdown');
            } else {
                setFileType('text');
            }
        } else {
            // Fallback content detection
            if (content.startsWith('%PDF')) {
                setFileType('pdf');
            } else if (content.includes('#') || content.includes('**') || content.includes('```')) {
                setFileType('markdown');
            } else if (content.includes('graph') || content.includes('flowchart') || content.includes('sequenceDiagram')) {
                setFileType('mermaid');
            } else {
                setFileType('text');
            }
        }
    }, [content, filePath]);

    if (fileType === 'pdf') {
        return (
            <Paper sx={{ height: '80vh', p: 3, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
                    Visualização de PDF em desenvolvimento. Por enquanto, mostrando conteúdo como texto:
                </Typography>
                <Box sx={{ 
                    border: 1, 
                    borderColor: 'divider', 
                    borderRadius: 1, 
                    p: 2, 
                    overflow: 'auto', 
                    whiteSpace: 'pre-wrap', 
                    flex: 1,
                    bgcolor: 'background.default'
                }}>
                    {content}
                </Box>
            </Paper>
        );
    }

    if (fileType === 'docx') {
        return (
            <Paper sx={{ height: '80vh', overflow: 'auto', p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Documento DOCX:</Typography>
                <Box sx={{ 
                    border: 1, 
                    borderColor: 'divider', 
                    borderRadius: 1, 
                    p: 2, 
                    whiteSpace: 'pre-wrap',
                    bgcolor: 'background.default'
                }}>
                    {content}
                </Box>
            </Paper>
        );
    }

    if (fileType === 'excel') {
        const lines = content.split('\n').filter(line => line.trim());
        const rows = lines.map(line => line.split(',').map(cell => cell.trim()));

        return (
            <Paper sx={{ overflow: 'auto', maxHeight: '80vh', p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Dados Excel/CSV:</Typography>
                <Table>
                    <TableBody>
                        {rows.map((row, i) => (
                            <TableRow key={i}>
                                {row.map((cell, j) => (
                                    <TableCell
                                        key={j}
                                        sx={i === 0 ? { fontWeight: 'bold', bgcolor: 'action.hover' } : {}}
                                    >
                                        {cell}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        );
    }

    if (fileType === 'mermaid') {
        return (
            <Paper sx={{ height: '80vh', overflow: 'auto', p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Diagrama Mermaid:</Typography>
                <Box sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 2,
                    bgcolor: 'background.default',
                    fontFamily: 'monospace'
                }}>
                    {content}
                </Box>
                <Typography variant="caption" sx={{ mt: 2, fontStyle: 'italic' }}>
                    Nota: Renderização completa de Mermaid será implementada em breve.
                </Typography>
            </Paper>
        );
    }

    if (fileType === 'markdown') {
        return (
            <Paper sx={{ height: '80vh', overflow: 'auto', p: 3 }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                </ReactMarkdown>
            </Paper>
        );
    }

    return (
        <Paper sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            p: 2,
            height: '80vh',
            overflow: 'auto',
            whiteSpace: 'pre-wrap'
        }}>
            {content}
        </Paper>
    );
});

DocumentViewer.displayName = 'DocumentViewer';

export default DocumentViewer;
