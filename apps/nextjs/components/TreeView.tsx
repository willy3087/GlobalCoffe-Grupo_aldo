import React, { useState, memo, useMemo } from 'react';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { ExpandMore, ChevronRight, Folder, InsertDriveFile } from '@mui/icons-material';

interface TreeNode {
    name: string;
    type: 'file' | 'directory';
    path?: string;
    children?: TreeNode[];
}

interface TreeViewProps {
    treeData: TreeNode[];
    onSelectFile: (filePath: string) => void;
}

const TreeView: React.FC<TreeViewProps> = memo(({ treeData, onSelectFile }) => {
    const [expanded, setExpanded] = useState<string[]>([]);

    const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
        setExpanded(nodeIds);
    };

    const renderTree = (nodes: TreeNode[], parentPath: string = ''): React.ReactNode => {
        return nodes.map((node, index) => {
            // Create a unique ID using the full path or parent path + name + index
            const nodeId = node.path || `${parentPath}/${node.name}_${index}`;
            
            if (node.type === 'directory' && node.children) {
                return (
                    <TreeItem
                        key={nodeId}
                        itemId={nodeId}
                        label={node.name}
                        slots={{
                            icon: Folder,
                            expandIcon: ChevronRight,
                            collapseIcon: ExpandMore
                        }}
                    >
                        {node.children && renderTree(node.children, nodeId)}
                    </TreeItem>
                );
            } else if (node.type === 'file') {
                return (
                    <TreeItem
                        key={nodeId}
                        itemId={nodeId}
                        label={node.name}
                        slots={{
                            icon: InsertDriveFile
                        }}
                        onClick={() => node.path && onSelectFile(node.path)}
                    />
                );
            }
            return null;
        });
    };

    return (
        <SimpleTreeView
            aria-label="file system navigator"
            slots={{
                collapseIcon: ExpandMore,
                expandIcon: ChevronRight
            }}
            expandedItems={expanded}
            onExpandedItemsChange={handleToggle}
            sx={{ flexGrow: 1, overflowY: 'auto' }}
        >
            {renderTree(treeData)}
        </SimpleTreeView>
    );
});


export default TreeView;
