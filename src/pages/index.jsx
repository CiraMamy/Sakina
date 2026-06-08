import Layout from "./Layout.jsx";

import Splash from "./Splash";

import Onboarding from "./Onboarding";

import Accueil from "./Accueil";

import Chat from "./Chat";

import Emotions from "./Emotions";

import Addictions from "./Addictions";

import Ressources from "./Ressources";

import Profil from "./Profil";

import Journal from "./Journal";

import Tendances from "./Tendances";

import Recompenses from "./Recompenses";

import Sommeil from "./Sommeil";

import Coaching from "./Coaching";

import Professionnels from "./Professionnels";

import Parametres from "./Parametres";

import Preferences from "./Preferences";

import Dashboard from "./Dashboard";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Splash: Splash,
    
    Onboarding: Onboarding,
    
    Accueil: Accueil,
    
    Chat: Chat,
    
    Emotions: Emotions,
    
    Addictions: Addictions,
    
    Ressources: Ressources,
    
    Profil: Profil,
    
    Journal: Journal,
    
    Tendances: Tendances,
    
    Recompenses: Recompenses,
    
    Sommeil: Sommeil,
    
    Coaching: Coaching,
    
    Professionnels: Professionnels,
    
    Parametres: Parametres,
    
    Preferences: Preferences,
    
    Dashboard: Dashboard,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Splash />} />
                
                
                <Route path="/Splash" element={<Splash />} />
                
                <Route path="/Onboarding" element={<Onboarding />} />
                
                <Route path="/Accueil" element={<Accueil />} />
                
                <Route path="/Chat" element={<Chat />} />
                
                <Route path="/Emotions" element={<Emotions />} />
                
                <Route path="/Addictions" element={<Addictions />} />
                
                <Route path="/Ressources" element={<Ressources />} />
                
                <Route path="/Profil" element={<Profil />} />
                
                <Route path="/Journal" element={<Journal />} />
                
                <Route path="/Tendances" element={<Tendances />} />
                
                <Route path="/Recompenses" element={<Recompenses />} />
                
                <Route path="/Sommeil" element={<Sommeil />} />
                
                <Route path="/Coaching" element={<Coaching />} />
                
                <Route path="/Professionnels" element={<Professionnels />} />
                
                <Route path="/Parametres" element={<Parametres />} />
                
                <Route path="/Preferences" element={<Preferences />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}