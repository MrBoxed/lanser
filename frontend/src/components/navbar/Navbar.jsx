import React from 'react';
import {
    AppBar, Box, Toolbar, IconButton, Typography, Menu, Container,
    Avatar, Button, Tooltip, MenuItem, Tabs, Tab
} from '@mui/material';

import {
    Menu as MenuIcon,
    Storage as StorageIcon,
    Movie as MovieIcon,
    Book as BookIcon,
    LibraryMusic as LibraryMusicIcon
} from '@mui/icons-material';

import Movies from '../movies/Movies';
import Music from '../music/Music';
import Books from '../books/Books';

import { useNavigate } from 'react-router-dom';



const PRODUCT_NAME = "Lanser";

const pages = [{
    name: "MOVIES",
    image: <MovieIcon />,
    component: <Movies />,
    path: '/movies'
}, {
    name: "BOOKS",
    image: <BookIcon />,
    component: <Books />,
    path: '/books'

}, {
    name: "MUSIC",
    image: <LibraryMusicIcon />,
    component: <Music />,
    path: '/music'
}];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {

    const navigate = useNavigate();

    const [loggedIn, setLoggedIn] = React.useState(false);
    const [currTab, setCurrTab] = React.useState(-1);

    function handleTabSelection(event, newValue) {
        setCurrTab(newValue);

        navigate(pages[newValue].path);
    }


    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position='sticky'
            sx={{
                px: "40px",
                backgroundColor: 'rgba(8, 8, 8, 0.2)',
            }} >

            <Toolbar disableGutters>

                <Box
                    sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => navigate('/home')}
                >
                    <StorageIcon sx={{ mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        {PRODUCT_NAME}
                    </Typography>
                </Box>

                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{ display: { xs: 'block', md: 'none' } }}
                    >
                        {pages.map((page, index) => (
                            <MenuItem key={index} onClick={handleCloseNavMenu}>
                                <Typography sx={{ textAlign: 'center' }}>{page.name}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>

                <StorageIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                <Typography
                    variant="h5"
                    noWrap
                    component="a"
                    onClick={() => navigate('/home')}
                    sx={{
                        mr: 2,
                        display: { xs: 'flex', md: 'none' },
                        flexGrow: 1,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    {PRODUCT_NAME}
                </Typography>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', display: { xs: 'none', md: 'flex' }, marginLeft: 'auto' }}>

                    <Tabs
                        onChange={(e, newValue) => handleTabSelection(e, newValue)}
                        value={(currTab < 0) ? false : currTab}
                        indicatorColor='secondary'
                        textColor='secondary'
                    >
                        {pages.map((page, index) => (

                            <Tab
                                key={index}
                                label={page.name}
                                sx={{ color: 'grey' }}
                            />

                        ))}
                    </Tabs>
                </Box>

                <Box sx={{ flexGrow: 0, marginLeft: 'auto' }}>

                    { // Checking if user LoggedIn :)
                        (loggedIn)
                            ? <>
                                < Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                                    </IconButton>
                                </Tooltip>

                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map((setting) => (
                                        <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                            <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                            : <Box
                                sx={{ marginLeft: 'auto', alignContent: 'space-between' }}>
                                <Button
                                    variant="contained"
                                    sx={{ mx: '5px' }}>Login </Button>

                                <Button
                                    variant="contained"
                                    sx={{ mx: '5px' }} >SignUp </Button>
                            </Box>
                    }
                </Box>
            </Toolbar>
        </AppBar >
    );
}

function IsUserLoggedIn() {
    return (
        <>

        </>
    )
}

export default ResponsiveAppBar;
