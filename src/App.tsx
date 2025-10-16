import CreateCallPage from "./pages/CreateCallPage";
import HomePage from "./pages/HomePage";
import JoinCallPage from "./pages/JoinCallPage";
import { Route, BrowserRouter, Routes } from 'react-router-dom'

export default function App() {

  return (
    <main className="bg-gray-800 min-h-screen text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://placehold.co/1920x1080/282c34/282c34?text=.')"}}></div>
      <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-md"></div>
      <div className="relative z-10 w-full flex items-center justify-center min-h-screen">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateCallPage />} />
            <Route path="/join" element={<JoinCallPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </main>
  );
}