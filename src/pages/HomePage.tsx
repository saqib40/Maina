import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    return (
        <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Maina</h1>
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
            Cuase we all love Nayaab
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/create')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 shadow-lg">
                Create a Call
            </button>
            <button onClick={() => navigate('/join')} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 shadow-lg">
                Join a Call
            </button>
            </div>
        </div>
    );
};

export default HomePage;