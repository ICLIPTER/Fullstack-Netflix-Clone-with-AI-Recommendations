import React, { useState } from 'react'
import {toast} from 'react-hot-toast';
import { getAIRecommendation } from '../lib/AIModel';
import RecommendedMovies from '../components/RecommendedMovies';

const steps = [
    {
        name: "Genre Selection",
        label: "What's your preferred genre?",
        options:[
            "Action",
            "Comedy",
            "Drama",
            "Horror",
            "Sci-Fi",
            "Fantasy",
            "Thriller",
            "Animation",
           
        ],
    },

    {
        name: "Mood Selection",
        label: "What's your preferred mood?",
        options:[
            "Happy",
            "Sad",
            "Exciting",
            "Relaxing",
            "Intense",
            "Thought-Provoking",
            "Adventurous",
        ],
    },

    {
        name: "decade",
        label: "Preferred decade?",
        options:[
            "2020s", "2010s", "2000s", "1990s", "Older"        
        ],
    },
     {
        name: "Language",
        label: "Preferred language?",
        options:[
            "english", "Hindi", "French",  "Spanish", "Japanese" , "Other"   
        ],
    },
     {
        name: "length",
        label: "Preferred movie length?",
        options:[
            "Short (<90 mins)", "Medium (90-120 mins)", "Long (>120 mins)"    
        ],
    },
];

const initialState = steps.reduce((acc,step) =>{
    acc[step.name] = "";
    return acc;
},{})




const AIRecommendations = () => {
    const [inputs, setInputs] = React.useState(initialState);
    const [Step, setStep] = React.useState(0);
    const [recommendation, setrecommendation] = React.useState([]);
    const [isloading, setLoading] = useState(false);

    const handleOption = (value) => {
  const updatedInputs = { ...inputs, [steps[Step].name]: value };
  console.log("Updated Inputs (before state set):", updatedInputs);
  setInputs(updatedInputs);
};

    const handleNext =() => {
        if (Step < steps.length - 1) {
            setStep(Step + 1);
        }else {
            console.log(inputs);
        }
    };

    const handleBack = () => {
        if (Step > 0) {
            setStep(Step - 1);
        }
    };
    const generateRecommendation =async () =>
{
    if(!inputs){
        toast("Please complete all steps before generating recommendations",)
    }
    setLoading(true);

    const userPrompt = `
Based on the following preferences:
- Genre: ${inputs.Genre}
- Mood: ${inputs.Mood}
- Decade: ${inputs.decade}
- Language: ${inputs.Language}
- Length: ${inputs.length} minutes

Return ONLY valid JSON with this format — no extra text, no explanations:

{
  "recommendations": [
    "Movie Title 1",
    "Movie Title 2",
    "Movie Title 3",
    "Movie Title 4",
    "Movie Title 5"
    "Movie Title 6",
    "Movie Title 7",
    "Movie Title 8",
    "Movie Title 9",
    "Movie Title 10"
  ]
}
`;
   const result = await getAIRecommendation(userPrompt);
  setLoading(false);

  if (result) {
    const cleanedResult = result.replace(/```json\n?/i, "").replace(/\n?```/i, "");
    try {
      const recommendationObj = JSON.parse(cleanedResult);
      setrecommendation(recommendationObj.recommendations || []);
      console.log(recommendationObj.recommendations);
    } catch (error) {
      console.log("Error parsing AI response:", error);
      toast.error("Could not understand AI response.");
    }
  } else {
    toast.error("Failed to generate recommendations. Please try again later.");
  }
};
  return (

    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181818] via-[#232323] to-[#181818] relative overflow-hidden'>
        {!(recommendation && recommendation.length > 0) && (
            <img src="/background_banner.jpg" className='absolute inset-0 w-full h-full object-cover opacity-20 blur-[2px]' />)}


        {recommendation && recommendation.length > 0 ? (
        <div className='w-full max-w-7xl mx-auto '>
            <h2 className='text-2xl font-bold text-white mb-4 text-center'>AI Recommended Movies </h2>
    < RecommendedMovies movieTitles={recommendation} />
    </div>
        ) : ( 
    <div className='relative w-full max-w-md mx-auto rounded-2xl bg-[#181818]/90 shadow-2xl border border-[#333] px-8 py-10 mt-4 flex flex-col items-center min-h-[480px]'>
        <h2 className='text-3xl font-extrabold mb-8 text-center text-white traking-tight drop-shadow-lg'>AI Movie Recommendation</h2>

        <div className='w-full flex items-center mb-8'>
            <div className=' flex-1 h-2 bg-[#232323] rounded-full overflow-hidden'>
                <div className='h-full bg-[#e50914] transition-all duration-300 ' style={{ width: `${((Step + 1) / steps.length) *100}% `}}></div>
            </div>
            <span className='ml-4 text-white text-sm font-semibold'>{Step + 1} / {steps.length}</span>
        </div>

        <div className='w-full flex flex-col flex-1'>
            <div className=' flex-1 mb-6'>
                <h3 className='text-lg font-semibold text-white mb-6 text-center'>{steps[Step].label}</h3>

    <div className='grid grid-cols-1 gap-3'>
                {steps[Step].options.map((opt) => (<button key={opt}
                 onClick={() => handleOption(opt)} className={`w-full py-3 rounded-xl border-2 transition font-semibold focus: outline-none focus:ring-2 active:scale-95 shadow-sm duration-150 focus:ring-[#e50914] text-base flex items-center justify-center gap-2 ${inputs[steps[Step].name] === opt  ? 'bg-[#e50914] border-[#e50914] text-white shadow-lg' : 'bg-[#333] border-[#444] text-white hover:bg-[#e50914]/80 hover:border-[#e50914]'}`}>
                    {opt}
                </button>))}
                
            </div> 
          </div>
          <div className='flex justify-between items-center mt-6'>
            <button type='button'
            onClick={handleBack} 
            disabled={Step === 0}
            className='px-6 py-2 rounded-lg font-semibold transition border-2 border-[#444] text-white bg-[#181818] hover:bg-[#232323]'> 
                Back
            </button>
            <button type='button' 
            onClick={Step === steps.length -1 ? generateRecommendation : handleNext} 
            disabled={!inputs[steps[Step].name] || isloading}
            className='px-6 py-2 rounded-lg font-semibold transition border-2 border-[#e50914] text-white bg-[#e50914] hover:bg-[#b0060f] ml-2 '>
                {Step === steps.length -1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
       </div>)}
    </div>
        
  )
}

export default AIRecommendations
