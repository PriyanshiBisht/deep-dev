import { useState,useEffect } from 'react'
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
const [reviewLoading, setReviewLoading] = useState(false);
const [reviewResult, setReviewResult] = useState(null);
const [reviewError, setReviewError] = useState(null);
const [stepIndex, setStepIndex] = useState(0);

const loadingSteps = [
  "Analyzing code structure...",
  "Checking against requirements...",
  "Identifying potential bugs...",
  "Generating scorecard...",
];
useEffect(() => {
  if (!reviewLoading) return;
  const interval = setInterval(() => {
    setStepIndex((prev) => (prev + 1) % loadingSteps.length);
  }, 1200);
  return () => clearInterval(interval);
}, [reviewLoading]);
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

  try {
    await fetch('https://deep-dev-ec2r.onrender.com/api/challenges/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userData.id, challengeId: challenge.id }),
    });
  } catch (err) {
    console.error("Solve tracking failed:", err);
  }

  setReviewLoading(true);
  setReviewError(null);
  setStepIndex(0);
  try {
    const res = await fetch('https://deep-dev-ec2r.onrender.com/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        challengeTitle: challenge.title,
        challengeDescription: challenge.description,
        html, css, js,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setReviewResult(data.review);
  } catch (err) {
    setReviewError("Review generate nahi ho payi, try again.");
  } finally {
    setReviewLoading(false);
  }
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
              className="bg-red-500 hover:bg-red-700 text-white rounded-lg px-2 py-2"
            >
              index.html
            </button>
            <button
              onClick={() => setActiveTab("css")}
              className="bg-blue-500 hover:bg-blue-700 text-white rounded-lg px-2 py-2"
            >
              style.css
            </button>
            <button
              onClick={() => setActiveTab("js")}
              className="bg-green-500 hover:bg-green-700 text-white rounded-lg px-2 py-2"
            >
              script.js
            </button>
          </div>

          <div className="h-87.5 md:h-auto">
            {activeTab === "html" && (
              <Editor language="html" theme="vs-dark" height="350px" value={html} onChange={(value) => setHtml(value)} />
            )}
            {activeTab === "css" && (
              <Editor language="css" theme="vs-dark" height="350px" value={css} onChange={(value) => setCss(value)} />
            )}
            {activeTab === "js" && (
              <Editor language="javascript" theme="vs-dark" height="350px" value={js} onChange={(value) => setJs(value)} />
            )}
          </div>

        </div>

        <div className="w-full md:w-1/2 p-4 bg-slate-950">
          <div className="h-87.5 md:h-full bg-white rounded-xl overflow-hidden border border-slate-800">
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
{(reviewLoading || reviewResult || reviewError) && (
  <div className="px-4 py-4 bg-slate-950 border-t border-slate-800">
    {reviewLoading && (
      <div className="flex items-center gap-3 text-slate-400">
        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p>{loadingSteps[stepIndex]}</p>
      </div>
    )}

    {reviewError && <p className="text-red-400">{reviewError}</p>}

    {reviewResult && !reviewLoading && (
      <div className="text-white">
        <div className="inline-block bg-purple-600 px-3 py-1 rounded-full font-semibold mb-3">
          Score: {reviewResult.score}/10
        </div>
        <div className="mb-3">
          <h4 className="text-slate-300 font-semibold mb-1">Bugs</h4>
          <ul className="list-disc list-inside text-slate-400 text-sm space-y-1">
            {reviewResult.bugs.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="text-slate-300 font-semibold mb-1">Suggestions</h4>
          <ul className="list-disc list-inside text-slate-400 text-sm space-y-1">
            {reviewResult.suggestions.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      </div>
    )}
  </div>
)}
    </div>
  )
}