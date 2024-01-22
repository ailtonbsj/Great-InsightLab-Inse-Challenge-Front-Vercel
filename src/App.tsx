import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './component/Home';
import SchoolDetail from './component/SchoolDetail';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/escola/:schoolId" element={<SchoolDetail />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;