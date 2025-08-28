import React, { memo } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { InsertDriveFile } from '@mui/icons-material';
import { FixedSizeList as List } from 'react-window';

interface DocumentCardProps {
    name: string;
    path: string;
    onSelect: (path: string) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = memo(({ name, path, onSelect }) => {
    return (
        <Card
            onClick={() => onSelect(path)}
            sx={{
                cursor: 'pointer',
                minHeight: 100,
                transition: 'box-shadow 0.2s ease',
                '&:hover': {
                    boxShadow: 2,
                },
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InsertDriveFile color="primary" />
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {name}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
});

interface DocumentCardsProps {
    documents: { name: string; path: string }[];
    onSelect: (path: string) => void;
}

const DocumentCards: React.FC<DocumentCardsProps> = memo(({ documents, onSelect }) => {
    // Se há muitos documentos, usar virtualização
    if (documents.length > 50) {
        const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
            const doc = documents[index];
            return (
                <div style={style}>
                    <DocumentCard name={doc.name} path={doc.path} onSelect={onSelect} />
                </div>
            );
        };

        return (
            <List
                height={600}
                itemCount={documents.length}
                itemSize={120}
                width="100%"
            >
                {Row}
            </List>
        );
    }

    // Para poucos documentos, renderizar normalmente
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
            {documents.map((doc) => (
                <DocumentCard key={doc.path} name={doc.name} path={doc.path} onSelect={onSelect} />
            ))}
        </Box>
    );
});

export default DocumentCards;
