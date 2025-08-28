import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Paper, Typography, TextField, Box } from '@mui/material';
import { Folder, InsertDriveFile, Description, Image, Code } from '@mui/icons-material';
import useMindMapStore from './MindMapStore';

const getFileIcon = (fileName: string, type: string) => {
    if (type === 'topic') return null; // Tópicos não têm ícone
    if (type === 'directory') return <Folder />;
    
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'md':
        case 'txt':
        case 'docx':
        case 'pdf':
            return <Description />;
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
            return <Image />;
        case 'js':
        case 'ts':
        case 'tsx':
        case 'jsx':
        case 'json':
            return <Code />;
        default:
            return <InsertDriveFile />;
    }
};

interface DocumentNodeProps extends NodeProps {
    id: string;
    data: any;
}

const DocumentNode = memo(({ id, data, isConnectable, selected }: DocumentNodeProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [label, setLabel] = useState(data.label);
    const updateNodeData = useMindMapStore(state => state.updateNodeData);

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLabel(e.target.value);
    };

    const handleLabelSubmit = () => {
        if (typeof id === 'string') {
            updateNodeData(id, { label });
        }
        setIsEditing(false);
    };

    return (
        <>
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
                style={{ background: '#555' }}
            />
            <Paper
                elevation={selected ? 4 : 1}
                sx={{
                    p: 2,
                    minWidth: 150,
                    maxWidth: 250,
                    cursor: 'pointer',
                    border: selected ? '2px solid #8B4513' : '1px solid #333',
                    bgcolor: data.type === 'topic' ? '#8B4513' : 
                             data.type === 'directory' ? 'background.paper' : 'background.default',
                    color: data.type === 'topic' ? 'white' : 'inherit',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        boxShadow: 3,
                    },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getFileIcon(data.label, data.type) && (
                        <Box sx={{ color: data.type === 'topic' ? 'white' : 'primary.main' }}>
                            {getFileIcon(data.label, data.type)}
                        </Box>
                    )}
                    {isEditing ? (
                        <TextField
                            value={label}
                            onChange={handleLabelChange}
                            onBlur={handleLabelSubmit}
                            onKeyPress={(e) => e.key === 'Enter' && handleLabelSubmit()}
                            size="small"
                            autoFocus
                            sx={{ flexGrow: 1 }}
                        />
                    ) : (
                        <Typography
                            variant="body2"
                            onDoubleClick={() => setIsEditing(true)}
                            sx={{
                                flexGrow: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {data.label}
                        </Typography>
                    )}
                </Box>
                {data.keywords && data.keywords.length > 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                        {data.keywords.join(', ')}
                    </Typography>
                )}
            </Paper>
            <Handle
                type="source"
                position={Position.Bottom}
                isConnectable={isConnectable}
                style={{ background: '#555' }}
            />
        </>
    );
});

DocumentNode.displayName = 'DocumentNode';

export default DocumentNode;