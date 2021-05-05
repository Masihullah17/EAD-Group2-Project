import React from 'react';

import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink,
} from './NavbarElements';

const Navbar = () => {
    return (
    <>
        <Nav>
            <Bars />
            
            <NavMenu>
                <NavLink to='/settings' activeStyle>
                    Settings
                </NavLink>


            </NavMenu>
            <NavBtn>
                <NavBtnLink to='/signin'>Sign In</NavBtnLink>
            </NavBtn>
         </Nav>
    </>
    
    )
}
export default Navbar;