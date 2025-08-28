'use client';

import React, { lazy, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

const MindMapView = lazy(() => import('./components/MindMapView'));

export default function MindMapPage() {
    return (
        <Box sx={{ height: '100vh', width: '100%' }}>
            <Suspense fallback={
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                </Box>
            }>
                <MindMapView />
            </Suspense>
        </Box>
    );
}