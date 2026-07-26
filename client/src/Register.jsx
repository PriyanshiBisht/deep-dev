import React,{ useState }  from 'react'
import { Link,useNavigate} from 'react-router-dom'
export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

const handleRegister = async () => {
  if (!username || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  const res = await fetch('https://deep-dev-ec2r.onrender.com/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();
  alert(data.message);

  if (res.ok) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    navigate('/profile');
  }
}
  return (
    <div>
      <div className='flex flex-col items-center justify-center h-screen p-4 bg-gray-800'>
        <div className='w-98 rounded bg-gray-800 p-4 shadow-2xl'>
          <h1 className='text-2xl font-bold text-center mb-2 text-blue-400'> DEEPDEV</h1> 
 <h1 className='m-4 text-center text-white'>Create Account</h1> 
    <input  value={username}
  onChange={(e) => setUsername(e.target.value)} type='text' placeholder='Enter your useranme' className='w-full border rounded-lg p-2 mb-4  bg-gray-800 text-white border-gray-600'/>
        <input   value={email}
  onChange={(e) => setEmail(e.target.value)} type='email' placeholder='Enter your email' className='w-full border rounded-lg p-2 mb-4  bg-gray-800 text-white border-gray-600'/>
        <input  value={password}
  onChange={(e) => setPassword(e.target.value)} type='password' placeholder='Enter your password' className='w-full border rounded-lg p-2 mb-4  bg-gray-800 text-white border-gray-600'/>
        <button className='bg-blue-500 text-white p-2 rounded-lg w-full' onClick={handleRegister}>Register</button> 
        
<p className="text-center mt-4 text-white">
  Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
</p> 
        </div> 
        </div>
      
    </div>
  )
}