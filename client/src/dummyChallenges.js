const dummyChallenges = [
  {
    id: 1,
    title: "Responsive Navbar",
    difficulty: "Easy",
    tags: ["Flexbox", "Layout"],
    description: "Build a navbar with a logo on the left and nav links on the right.",
    image: "https://placehold.co/600x400/1e293b/ffffff?text=Navbar",
    solved: false,
    starterCode: {
      html: `<nav class="navbar">
  <div class="logo">Brand</div>
  <ul class="nav-links">
    <li>Home</li>
    <li>About</li>
    <li>Contact</li>
  </ul>
</nav>`,
      css: `.navbar {
  /* make logo and links sit on opposite ends */
}`,
      js: ``,
    },
    solutionCode: {
      html: `<nav class="navbar">
  <div class="logo">Brand</div>
  <ul class="nav-links">
    <li>Home</li>
    <li>About</li>
    <li>Contact</li>
  </ul>
</nav>`,
      css: `.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #1e293b;
  color: white;
}
.nav-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
}`,
      js: ``,
    },
  },

  {
    id: 2,
    title: "Accordion FAQ",
    difficulty: "Medium",
    tags: ["JavaScript", "DOM"],
    description: "Build a 3-item FAQ accordion that expands/collapses on click.",
    image: "https://placehold.co/600x400/1e293b/ffffff?text=Accordion",
    solved: false,
    starterCode: {
      html: `<div class="accordion">
  <div class="item">
    <div class="question">What is React?</div>
    <div class="answer">A JS library for building UIs.</div>
  </div>
  <div class="item">
    <div class="question">What is a Component?</div>
    <div class="answer">A reusable piece of UI.</div>
  </div>
  <div class="item">
    <div class="question">What are Hooks?</div>
    <div class="answer">Functions to use state in components.</div>
  </div>
</div>`,
      css: `.answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.answer.active {
  max-height: 200px;
  padding: 8px 0;
}`,
      js: `// On question click, toggle "active" class on its sibling .answer`,
    },
    solutionCode: {
      html: `<div class="accordion">
  <div class="item">
    <div class="question">What is React?</div>
    <div class="answer">A JS library for building UIs.</div>
  </div>
  <div class="item">
    <div class="question">What is a Component?</div>
    <div class="answer">A reusable piece of UI.</div>
  </div>
  <div class="item">
    <div class="question">What are Hooks?</div>
    <div class="answer">Functions to use state in components.</div>
  </div>
</div>`,
      css: `.answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.answer.active {
  max-height: 200px;
  padding: 8px 0;
}`,
      js: `document.querySelectorAll(".question").forEach((q) => {
  q.addEventListener("click", () => {
    q.nextElementSibling.classList.toggle("active");
  });
});`,
    },
  },

  {
    id: 3,
    title: "Counter App",
    difficulty: "Easy",
    tags: ["JavaScript", "Events"],
    description: "Build a counter with increment, decrement, and reset buttons.",
    image: "https://placehold.co/600x400/1e293b/ffffff?text=Counter",
    solved: false,
    starterCode: {
      html: `<div class="counter">
  <button id="decrement">-</button>
  <span id="count">0</span>
  <button id="increment">+</button>
  <button id="reset">Reset</button>
</div>`,
      css: `.counter {
  display: flex;
  gap: 1rem;
  align-items: center;
}`,
      js: `// Add click handlers for increment, decrement, reset`,
    },
    solutionCode: {
      html: `<div class="counter">
  <button id="decrement">-</button>
  <span id="count">0</span>
  <button id="increment">+</button>
  <button id="reset">Reset</button>
</div>`,
      css: `.counter {
  display: flex;
  gap: 1rem;
  align-items: center;
}`,
      js: `let count = 0;
const countEl = document.getElementById("count");

document.getElementById("increment").onclick = () => countEl.textContent = ++count;
document.getElementById("decrement").onclick = () => countEl.textContent = --count;
document.getElementById("reset").onclick = () => countEl.textContent = count = 0;`,
    },
  },

  {
    id: 4,
    title: "Pricing Cards",
    difficulty: "Easy",
    tags: ["Flexbox", "Layout"],
    description: "Build a 3-tier pricing layout with a highlighted 'popular' plan.",
    image: "https://placehold.co/600x400/1e293b/ffffff?text=Pricing+Cards",
    solved: false,
    starterCode: {
      html: `<div class="pricing">
  <div class="card">Basic</div>
  <div class="card popular">Pro</div>
  <div class="card">Enterprise</div>
</div>`,
      css: `.pricing {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
.card {
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}`,
      js: ``,
    },
    solutionCode: {
      html: `<div class="pricing">
  <div class="card">Basic</div>
  <div class="card popular">Pro</div>
  <div class="card">Enterprise</div>
</div>`,
      css: `.pricing {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
.card {
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.popular {
  border-color: purple;
  transform: scale(1.05);
}`,
      js: ``,
    },
  },

  {
    id: 5,
    title: "Debounced Search Bar",
    difficulty: "Hard",
    tags: ["JavaScript", "Performance"],
    description: "Build a search input that waits 500ms after typing stops before showing results.",
    image: "https://placehold.co/600x400/1e293b/ffffff?text=Search+Bar",
    solved: false,
    starterCode: {
      html: `<input type="text" id="search" placeholder="Search..." />
<p id="result"></p>`,
      css: `input { padding: 0.5rem; width: 200px; }`,
      js: `// Debounce: only update #result 500ms after the user stops typing`,
    },
    solutionCode: {
      html: `<input type="text" id="search" placeholder="Search..." />
<p id="result"></p>`,
      css: `input { padding: 0.5rem; width: 200px; }`,
      js: `let timer;
document.getElementById("search").addEventListener("input", (e) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    document.getElementById("result").textContent = "Searching: " + e.target.value;
  }, 500);
});`,
    },
  },

  {
    id: 6,
    title: "Modal Popup",
    difficulty: "Medium",
    tags: ["JavaScript", "DOM"],
    description: "Build a modal that opens on button click and closes on overlay click or close button.",
    image: "https://placehold.co/600x400/1e293b/ffffff?text=Modal",
    solved: false,
    starterCode: {
      html: `<button id="openBtn">Open Modal</button>
<div id="overlay" class="overlay hidden">
  <div class="modal">
    <button id="closeBtn">X</button>
    <p>Modal Content</p>
  </div>
</div>`,
      css: `.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.hidden { display: none; }
.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
}`,
      js: `// Show overlay on openBtn click, hide on closeBtn or overlay click`,
    },
    solutionCode: {
      html: `<button id="openBtn">Open Modal</button>
<div id="overlay" class="overlay hidden">
  <div class="modal">
    <button id="closeBtn">X</button>
    <p>Modal Content</p>
  </div>
</div>`,
      css: `.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.hidden { display: none; }
.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
}`,
      js: `const overlay = document.getElementById("overlay");

document.getElementById("openBtn").onclick = () => overlay.classList.remove("hidden");
document.getElementById("closeBtn").onclick = () => overlay.classList.add("hidden");
overlay.onclick = (e) => { if (e.target === overlay) overlay.classList.add("hidden"); };`,
    },
  },
];

export default dummyChallenges;