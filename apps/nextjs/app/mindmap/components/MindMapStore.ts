import { create } from 'zustand';
import { Node, Edge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from '@xyflow/react';

export interface DocumentNode extends Node {
    data: {
        label: string;
        path: string;
        type: 'file' | 'directory' | 'topic';
        documentType?: string;
        lastModified?: string;
        size?: number;
        keywords?: string[];
        strength?: number;
    };
}

interface MindMapState {
    nodes: DocumentNode[];
    edges: Edge[];
    selectedNode: string | null;
    
    // Actions
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    setSelectedNode: (nodeId: string | null) => void;
    addChildNode: (parentId: string, childData: Partial<DocumentNode['data']>) => void;
    updateNodeData: (nodeId: string, data: Partial<DocumentNode['data']>) => void;
    loadFromDocumentTree: (documentTree: any[]) => void;
}

const useMindMapStore = create<MindMapState>((set, get) => ({
    nodes: [],
    edges: [],
    selectedNode: null,

    onNodesChange: (changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes) as DocumentNode[],
        });
    },

    onEdgesChange: (changes) => {
        set({
            edges: applyEdgeChanges(changes, get().edges) as Edge[],
        });
    },

    setSelectedNode: (nodeId) => {
        set({ selectedNode: nodeId });
    },

    addChildNode: (parentId, childData) => {
        const parentNode = get().nodes.find(n => n.id === parentId);
        if (!parentNode) return;

        const childId = `${parentId}-${Date.now()}`;
        const childNode: DocumentNode = {
            id: childId,
            type: 'documentNode',
            position: {
                x: parentNode.position.x + 200,
                y: parentNode.position.y + 50,
            },
            data: {
                label: 'Novo Documento',
                path: '',
                type: 'file',
                ...childData,
            },
        };

        const edge: Edge = {
            id: `${parentId}-${childId}`,
            source: parentId,
            target: childId,
            type: 'smoothstep',
        };

        set({
            nodes: [...get().nodes, childNode],
            edges: [...get().edges, edge],
        });
    },

    updateNodeData: (nodeId, data) => {
        set({
            nodes: get().nodes.map(node =>
                node.id === nodeId
                    ? { ...node, data: { ...node.data, ...data } }
                    : node
            ),
        });
    },

    loadFromDocumentTree: (documentTree) => {
        const nodes: DocumentNode[] = [];
        const edges: Edge[] = [];
        let yOffset = 0;

        function processNode(item: any, parentId: string | null, x: number, y: number, level: number = 0) {
            const nodeId = item.path || `node-${nodes.length}`;
            
            nodes.push({
                id: nodeId,
                type: 'documentNode',
                position: { x, y },
                data: {
                    label: item.name,
                    path: item.path || '',
                    type: item.type,
                },
            });

            if (parentId) {
                edges.push({
                    id: `${parentId}-${nodeId}`,
                    source: parentId,
                    target: nodeId,
                    type: 'smoothstep',
                });
            }

            if (item.children && item.children.length > 0) {
                const childSpacing = 150;
                const totalWidth = (item.children.length - 1) * childSpacing;
                const startX = x - totalWidth / 2;

                item.children.forEach((child: any, index: number) => {
                    processNode(
                        child,
                        nodeId,
                        startX + index * childSpacing,
                        y + 150,
                        level + 1
                    );
                });
            }
        }

        // Processar árvore de documentos
        documentTree.forEach((item, index) => {
            processNode(item, null, index * 300, yOffset, 0);
        });

        set({ nodes, edges });
    },
}));

export default useMindMapStore;