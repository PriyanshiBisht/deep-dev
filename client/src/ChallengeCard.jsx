import { Link } from 'react-router-dom'
export default function ChallengeCard({ id, title, difficulty, tags, description, image, solved }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-purple-500 transition-colors">
      
    
      <img 
        src={image} 
        alt={title} 
        className="h-32 w-full object-cover rounded-lg mb-3" 
      />

     
      <div className="flex gap-2 mb-2 flex-wrap">
        <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 font-medium">
          {difficulty}
        </span>

        {tags.map((tag) => (
          <span key={tag} className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400">
            {tag}
          </span>
        ))}
      </div>

      
      <h3 className="text-white font-semibold mb-1">{title}</h3>

    
      <p className="text-slate-400 text-sm mb-4">
        {description}
      </p>

     
      <Link 
  to={`/challenge-detail/${id}`}
  className="w-full block text-center bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
>
  {solved ? "Practice Again" : "Start Challenge"}
</Link>
    </div>
  );
}