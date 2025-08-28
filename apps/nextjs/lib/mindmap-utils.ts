import { Node, Edge } from '@xyflow/react';

export interface DocumentTreeNode {
    name: string;
    type: 'file' | 'directory';
    path?: string;
    children?: DocumentTreeNode[];
}

// Algoritmo de layout otimizado para árvore
export function calculateTreeLayout(
    nodes: DocumentTreeNode[],
    options = {
        nodeWidth: 150,
        nodeHeight: 80,
        levelSeparation: 150,
        siblingSeparation: 100,
    }
) {
    const layoutNodes: Node[] = [];
    const layoutEdges: Edge[] = [];

    // Algoritmo de Reingold-Tilford simplificado
    function calculateNodePositions(
        node: DocumentTreeNode,
        depth: number = 0,
        index: number = 0,
        parentId: string | null = null
    ): { width: number; x: number } {
        const nodeId = node.path || `node-${layoutNodes.length}`;
        
        if (!node.children || node.children.length === 0) {
            // Nó folha
            const x = index * options.siblingSeparation;
            const y = depth * options.levelSeparation;
            
            layoutNodes.push({
                id: nodeId,
                type: 'documentNode',
                position: { x, y },
                data: {
                    label: node.name,
                    path: node.path || '',
                    type: node.type,
                },
            });

            if (parentId) {
                layoutEdges.push({
                    id: `${parentId}-${nodeId}`,
                    source: parentId,
                    target: nodeId,
                    type: 'smoothstep',
                });
            }

            return { width: options.nodeWidth, x };
        }

        // Nó com filhos
        let childrenWidth = 0;
        let firstChildX = 0;
        let lastChildX = 0;

        node.children.forEach((child, i) => {
            const childResult = calculateNodePositions(
                child,
                depth + 1,
                childrenWidth,
                nodeId
            );
            
            if (i === 0) firstChildX = childResult.x;
            lastChildX = childResult.x;
            childrenWidth += childResult.width + options.siblingSeparation;
        });

        // Centralizar pai sobre os filhos
        const x = (firstChildX + lastChildX) / 2;
        const y = depth * options.levelSeparation;

        layoutNodes.push({
            id: nodeId,
            type: 'documentNode',
            position: { x, y },
            data: {
                label: node.name,
                path: node.path || '',
                type: node.type,
            },
        });

        if (parentId) {
            layoutEdges.push({
                id: `${parentId}-${nodeId}`,
                source: parentId,
                target: nodeId,
                type: 'smoothstep',
            });
        }

        return { width: childrenWidth - options.siblingSeparation, x };
    }

    // Processar cada árvore raiz
    let totalWidth = 0;
    nodes.forEach((rootNode, index) => {
        const result = calculateNodePositions(rootNode, 0, totalWidth);
        totalWidth += result.width + options.siblingSeparation * 2;
    });

    // Centralizar todo o layout
    const centerX = totalWidth / 2;
    layoutNodes.forEach(node => {
        node.position.x -= centerX;
    });

    return { nodes: layoutNodes, edges: layoutEdges };
}

// Filtrar nós por tipo de documento
export function filterNodesByType(
    nodes: Node[],
    edges: Edge[],
    fileTypes: string[]
): { nodes: Node[]; edges: Edge[] } {
    const filteredNodeIds = new Set(
        nodes
            .filter(node => {
                const ext = (node.data as any).label?.split('.').pop()?.toLowerCase();
                return fileTypes.includes(ext || '');
            })
            .map(node => node.id)
    );

    const filteredEdges = edges.filter(
        edge => filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
    );

    return {
        nodes: nodes.filter(node => filteredNodeIds.has(node.id)),
        edges: filteredEdges,
    };
}

// Buscar caminho entre dois documentos
export function findPathBetweenNodes(
    sourceId: string,
    targetId: string,
    edges: Edge[]
): string[] {
    const adjacencyList: Record<string, string[]> = {};
    
    // Construir lista de adjacência
    edges.forEach(edge => {
        if (!adjacencyList[edge.source]) adjacencyList[edge.source] = [];
        if (!adjacencyList[edge.target]) adjacencyList[edge.target] = [];
        adjacencyList[edge.source].push(edge.target);
        adjacencyList[edge.target].push(edge.source);
    });

    // BFS para encontrar caminho mais curto
    const queue: string[][] = [[sourceId]];
    const visited = new Set<string>([sourceId]);

    while (queue.length > 0) {
        const path = queue.shift()!;
        const node = path[path.length - 1];

        if (node === targetId) {
            return path;
        }

        for (const neighbor of adjacencyList[node] || []) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push([...path, neighbor]);
            }
        }
    }

    return [];
}