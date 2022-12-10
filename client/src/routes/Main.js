import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar';
import Home from '../pages/Home';
import CreateShowdown from '../pages/CreateShowdown';
import { GlobalContextProvider } from '../context/index';

function Main() {
    return (
        <BrowserRouter>
            <GlobalContextProvider>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/createShowdown" element={<CreateShowdown />} />
                </Routes>
            </GlobalContextProvider>
        </BrowserRouter>
    );
}

export default Main;
