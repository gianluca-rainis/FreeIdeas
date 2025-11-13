import React from 'react'

const BANNERTEXT = "";
const SHOWBANNER = false;

function ColoredTitle() {
    return (
        <h1>
            A place where <strong>your</strong>{' '}
            <span style={{color: '#ffcf00'}}>I</span>
            <span style={{color: '#f4d54b'}}>d</span>
            <span style={{color: '#e4c53d'}}>e</span>
            <span style={{color: '#c0a634'}}>a</span>
            <span style={{color: '#a28710'}}>s</span>
            {' '}can be{' '}
            <span style={{color: '#59ff97'}}>F</span>
            <span style={{color: '#47dc55'}}>r</span>
            <span style={{color: '#05a814'}}>e</span>
            <span style={{color: '#106d19'}}>e</span>
        </h1>
    )
}

function Banner({ message = "", show = false }) {
    return (
        <div style={{
            backgroundColor: '#ffbf8f',
            width: '100%',
            marginBottom: '15px',
            justifyItems: 'center',
            display: show ? undefined : 'none'
        }}>
            <h1 style={{
                width: 'fit-content',
                textAlign: 'center',
                padding: '10px',
                color: 'black'
            }}>
                {message}
            </h1>
        </div>
    )
}

function Header() {
    return (
        <header>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                alignItems: 'center',
                padding: '20px 0 20px 0'
            }}>
                <Banner message={BANNERTEXT} show={SHOWBANNER} />
                <ColoredTitle />
            </div>
        </header>
    )
}

export default Header