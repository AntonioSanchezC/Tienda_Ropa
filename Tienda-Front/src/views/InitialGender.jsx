import { useNavigate } from "react-router-dom";
import useQuisco from "../hooks/useQuiosco";

export default function InitialGender() {

    const baseURL = import.meta.env.VITE_API_URL;
    const { 
        gender,
        selectGender, } = useQuisco();
    const navigate = useNavigate();


    const handleGenderClick = (gender) => {
        selectGender(gender);
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center justify-center md:w-5/6 md:h-5/6 mx-auto">
            <div className="md:w-2/12 md:h-2/12 mb-8">
                <img src={`${baseURL}/icon/Logo2.png`} alt="logo icon" />
            </div>
            <div className="flex justify-between md:w-3/6 md:h-2/6">
                <div 
                    className="w-3/6 md:mr-8 transform transition-transform duration-300 hover:scale-125 hover:shadow-xl hover:-translate-y-2"
                    onClick={() => handleGenderClick('F')}
                >
                    <img src={`${baseURL}/icon/fem.png`} alt="fem access" className="md:w-full mb-4" />
                </div>
                <div 
                    className="w-3/6 md:ml-8 transform transition-transform duration-300 hover:scale-125 hover:shadow-xl hover:-translate-y-2"
                    onClick={() => handleGenderClick('M')}
                >
                    <img src={`${baseURL}/icon/masc.png`} alt="masc access" className="md:w-full" />
                </div>
            </div>
        </div>
    );
}