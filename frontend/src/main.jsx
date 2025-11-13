import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Head from './Head.jsx'
import Nav from './Nav.jsx'
import Footer from './Footer.jsx'
import Header from './Header.jsx'

ReactDOM.createRoot(document.querySelector('main')).render(
    <App />
)

ReactDOM.createRoot(document.querySelector("header")).render(
    <Header />
)

ReactDOM.createRoot(document.querySelector("head")).render(
    <Head />
)

ReactDOM.createRoot(document.querySelector("nav")).render(
    <Nav />
)

ReactDOM.createRoot(document.querySelector("footer")).render(
    <Footer />
)