import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Coffee as CoffeeIcon } from '@mui/icons-material';

export default function NavBar() {
    return (
        <AppBar position="sticky" sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
            <Toolbar sx={{ gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                    <CoffeeIcon sx={{ color: 'primary.main' }} />
                    <Typography 
                        variant="h6" 
                        component={Link} 
                        href="/"
                        sx={{ 
                            textDecoration: 'none', 
                            color: 'primary.main',
                            fontWeight: 'bold'
                        }}
                    >
                        Global Coffee
                    </Typography>
                    <Box sx={{ ml: 4, display: { xs: 'none', md: 'flex' }, gap: 3 }}>
                        <Button component={Link} href="/" color="inherit">
                            Home
                        </Button>
                        <Button component={Link} href="/mindmap" color="inherit">
                            Mindmap
                        </Button>
                        <Button component={Link} href="/about" color="inherit">
                            Sobre
                        </Button>
                        <Button component={Link} href="/api/documents" color="inherit">
                            API
                        </Button>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="outlined" sx={{ display: { xs: 'none', md: 'block' } }}>
                        Entrar
                    </Button>
                    <Button variant="contained" color="primary">
                        Começar
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
