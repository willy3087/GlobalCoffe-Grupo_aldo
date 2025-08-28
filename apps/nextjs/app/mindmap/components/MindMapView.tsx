import React, { useEffect, useCallback, useMemo } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    BackgroundVariant,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    ConnectionMode,
    Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Edge as FlowEdge } from '@xyflow/react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { Add, FitScreen, ZoomIn, ZoomOut } from '@mui/icons-material';
import DocumentNode from './DocumentNode';
import useMindMapStore from './MindMapStore';

const nodeTypes = {
    documentNode: DocumentNode,
};

const MindMapView: React.FC = () => {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        loadFromDocumentTree,
        addChildNode,
    } = useMindMapStore();

    // Carregar mindmap baseado em relações
    useEffect(() => {
        async function loadMindMap() {
            try {
                const response = await fetch('/api/mindmap');
                const data = await response.json();
                
                // Carregar nodes e edges diretamente
                if (data.nodes && data.edges) {
                    onNodesChange(data.nodes.map((node: any) => ({ type: 'add', item: node })));
                    onEdgesChange(data.edges.map((edge: any) => ({ type: 'add', item: edge })));
                }
            } catch (error) {
                console.error('Erro ao carregar mindmap:', error);
            }
        }
        loadMindMap();
    }, [onNodesChange, onEdgesChange]);

    const onConnect = useCallback(
        (params: Connection | Edge) => {
            const newEdge = {
                ...params,
                type: 'smoothstep',
            };
            onEdgesChange([{ type: 'add', item: newEdge as Edge }]);
        },
        [onEdgesChange]
    );

    const handleAddNode = useCallback(() => {
        const selectedNode = nodes.find(n => n.selected);
        if (selectedNode) {
            addChildNode(selectedNode.id, {
                label: 'Novo Documento',
                type: 'file',
            });
        }
    }, [nodes, addChildNode]);

    return (
        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                connectionMode={ConnectionMode.Loose}
                fitView
                fitViewOptions={{
                    padding: 0.2,
                }}
            >
                <Background color="#333" variant={BackgroundVariant.Dots} />
                <MiniMap
                    nodeColor={(node) => {
                        return node.data.type === 'directory' ? '#8B4513' : '#666';
                    }}
                    style={{
                        backgroundColor: '#1e1e1e',
                        border: '1px solid #333',
                    }}
                />
                <Controls
                    style={{
                        backgroundColor: '#1e1e1e',
                        border: '1px solid #333',
                    }}
                />
                
                <Panel position="top-left">
                    <Paper elevation={1} sx={{ p: 2, maxWidth: 300 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Mapa de Relações
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Visualização automática baseada no conteúdo dos documentos
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="caption" sx={{ 
                                bgcolor: '#8B4513', 
                                color: 'white', 
                                px: 1, 
                                py: 0.5, 
                                borderRadius: 1 
                            }}>
                                Tópicos Centrais
                            </Typography>
                            <Typography variant="caption" sx={{ 
                                bgcolor: 'background.paper', 
                                px: 1, 
                                py: 0.5, 
                                borderRadius: 1,
                                border: '1px solid #333'
                            }}>
                                Documentos
                            </Typography>
                        </Box>
                    </Paper>
                </Panel>

                <Panel position="bottom-left">
                    <Paper elevation={1} sx={{ p: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            Conexões mostram relações temáticas entre documentos
                        </Typography>
                    </Paper>
                </Panel>
            </ReactFlow>
        </Box>
    );
};

export default MindMapView;