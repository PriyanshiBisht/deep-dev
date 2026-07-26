import { useState } from 'react'
import Editor from '@monaco-editor/react';
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import dummyChallenges from './dummyChallenges'  
import { useNavigate } from 'react-router-dom';
export default function ChallengeDetail() {
    const { id } = useParams();
    const challenge = dummyChallenges.find((c) => c.id === parseInt(id));
    const navigate = useNavigate();
 const [activeTab, setActiveTab] = useState("html");
const [html, setHtml] = useState(challenge?.starterCode.html || "");
const [css, setCss] = useState(challenge?.starterCode.css || "");
const [js, setJs] = useState(challenge?.starterCode.js || "");
const [viewedSolution, setViewedSolution] = useState(false);
const handleReset = () => {
  setHtml(challenge?.starterCode.html || "");
  setCss(challenge?.starterCode.css || "");
  setJs(challenge?.starterCode.js || "");
   setViewedSolution(false); 
}
const handleViewSolution = () => {
  setHtml(challenge?.solutionCode.html || "");
  setCss(challenge?.solutionCode.css || "");
  setJs(challenge?.solutionCode.js || "");
  setViewedSolution(true);
}
const handleSubmit = async () => {
  if (viewedSolution) {
    alert("You viewed the solution for this one — try solving it yourself next time!");
    return;
  }

  const userData = JSON.parse(localStorage.getItem('user'));

  const res = await fetch('https://deep-dev-ec2r.onrender.com/api/challenges/solve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: userData.id, challengeId: challenge.id }),
  });

  const data = await res.json();
  alert("Great job! Challenge marked as solved.");
  navigate('/profile');
}
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">

     
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900 border-b border-slate-800 px-4 py-3 gap-2">
       
        <h1 className="text-white font-semibold">{challenge?.title}</h1>
        <div className="flex gap-2">
          <button className="text-slate-400 text-sm px-3 py-1 rounded hover:bg-slate-800" onClick={handleReset}>
            Reset Code
          </button>
          <Link to="/challenge" className="text-slate-400 text-sm px-3 py-1 rounded hover:bg-slate-800">
  Go Back to Challenges
</Link>    
          <button className="text-slate-400 text-sm px-3 py-1 rounded hover:bg-slate-800" onClick={handleViewSolution}>
            View Solution
          </button>
          <button className="bg-purple-600 text-white text-sm px-4 py-1 rounded hover:bg-purple-700" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1">

      
        <div className="w-full md:w-1/2 flex flex-col">

          <div className="flex bg-slate-900 border-b border-slate-800 gap-2">
            <button
              onClick={() => setActiveTab("html")}
              className=" bg-red-500 hover:bg-red-700 text-white rounded-lg px-2 py-2"
            >
              index.html
            </button>
            <button
              onClick={() => setActiveTab("css")}
              className=" bg-blue-500 hover:bg-blue-700 text-white rounded-lg px-2 py-2"
            >
              style.css
            </button>
            <button
              onClick={() => setActiveTab("js")}
              className=" bg-green-500 hover:bg-green-700 text-white rounded-lg px-2 py-2"
            >
              script.js
            </button>
          </div>

          <div className="flex-1 h-100 md:h-auto">
            {activeTab === "html" && (
              <Editor language="html" theme="vs-dark" value={html} onChange={(value) => setHtml(value)} />
            )}
            {activeTab === "css" && (
              <Editor language="css" theme="vs-dark" value={css} onChange={(value) => setCss(value)} />
            )}
            {activeTab === "js" && (
              <Editor language="javascript" theme="vs-dark" value={js} onChange={(value) => setJs(value)} />
            )}
          </div>

        </div>

       
        <div className="w-full md:w-1/2 p-4 bg-slate-950">
          <div className="h-100 md:h-full bg-white rounded-xl overflow-hidden border border-slate-800">
            <iframe
              srcDoc={`
                <html>
                  <head><style>${css}</style></head>
                  <body>${html}<script>${js}</script></body>
                </html>
              `}
              className="w-full h-full"
            />
          </div>
        </div>

      </div>

    </div>
  )
}