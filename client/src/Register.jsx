import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
const [registering, setRegistering] = useState(false);
  const handleRegister = async () => {
    if (!username || !email || !password) {
      alert("Please fill all fields");
      return;
    }
setRegistering(true);
    const res = await fetch('https://deep-dev-ec2r.onrender.com/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    setRegistering(false);
   

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/profile');
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-950">

     <div className="hidden md:flex w-1/2 flex-col justify-center items-center bg-slate-900 p-12">
  
  <h1 className="text-4xl font-bold text-purple-400 mb-4 animate-pulse">DeepDev</h1>
  <p className="text-slate-400 text-center mb-8">Practice frontend challenges. Build real skills.</p>

  <div className="space-y-4 text-left">
    <div className="flex items-center gap-3 text-slate-300">
      <span className="text-purple-400 text-xl">✓</span>
      <span>Real interview-style challenges</span>
    </div>
    <div className="flex items-center gap-3 text-slate-300">
      <span className="text-purple-400 text-xl">✓</span>
      <span>Live code editor with instant preview</span>
    </div>
    <div className="flex items-center gap-3 text-slate-300">
      <span className="text-purple-400 text-xl">✓</span>
      <span>Track your progress as you learn</span>
    </div>
  </div>
</div>

     
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-[fadeIn_0.5s_ease-in]">
          
          <h1 className="text-2xl font-bold text-center mb-1 text-purple-400 md:hidden">DEEPDEV</h1>
          <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
          <p className="text-slate-400 text-sm mb-6">Start solving frontend challenges today</p>

          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
            className="w-full border rounded-lg p-3 mb-3 bg-slate-900 text-white border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg p-3 mb-3 bg-slate-900 text-white border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg p-3 mb-4 bg-slate-900 text-white border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />

          <button
            onClick={handleRegister} disabled={registering}
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg w-full font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {registering ? "Creating account..." : "Register"}
          </button>

          <p className="text-center mt-5 text-slate-400 text-sm">
            Already have an account? <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">Login</Link>
          </p>
        </div>
      </div>

    </div>
  )
}