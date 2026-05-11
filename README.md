# cs-canvas

> Visualizing Computer Science, one concept at a time.

**cs-canvas** is an interactive learning platform that brings core Computer Science concepts to life through real-time animations, 2D/3D visualizations, and hands-on simulations. Instead of reading static diagrams, you *run* the algorithm, *step through* the process, and *feel* how it works.

---

## ✨ Features

- 🎮 **Interactive Inputs** — Provide your own data and watch it execute step by step
- ⏱ **Speed Control** — Adjust animation speed from slow-motion to real-time
- 📖 **Step Explanations** — Each step narrated with *why* it happened, not just *what*
- 🌐 **3D Visualizations** — CPU pipelines, cache hierarchies, and memory structures rendered in Three.js
- 📱 **Responsive Design** — Works on desktop and tablet

---

## 📚 Topics Covered

### Data Structures & Algorithms
- Sorting: Bubble, Quick, Merge, Heap
- Trees: BST insert/delete/search, AVL rotations
- Graphs: BFS, DFS, Dijkstra, A*
- Dynamic Programming: table fill visualization

### Operating Systems
- Process Scheduling: Round Robin, SJF, Priority
- Page Replacement: LRU, FIFO, Optimal
- Deadlock: resource allocation graph, detection

### Networks
- TCP 3-way Handshake animation
- OSI 7-layer packet flow
- Routing algorithms

### Databases
- B-Tree index structure and traversal
- Transaction isolation & MVCC
- Join algorithms: Nested Loop, Hash, Merge

### Computer Architecture *(Three.js)*
- CPU pipeline stages
- Cache hierarchy (L1/L2/L3) 3D model
- Virtual memory address translation

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| 2D Visualization | [D3.js](https://d3js.org/) |
| 3D Visualization | [Three.js](https://threejs.org/) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Deployment | [Vercel](https://vercel.com/) |

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/scrawl-labs/cs-canvas.git
cd cs-canvas

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗺 Roadmap

- [x] Project setup & architecture
- [ ] Landing page with topic navigation
- [ ] Sorting algorithm visualizer
- [ ] BST visualizer
- [ ] Graph traversal (BFS/DFS)
- [ ] OS process scheduler simulation
- [ ] Network packet flow animation
- [ ] Database B-Tree explorer
- [ ] Computer architecture 3D view

---

## 🤝 Contributing

This is primarily a personal learning project, but PRs and issues are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/topic-name`
3. Commit your changes: `git commit -m "feat: add heap sort visualizer"`
4. Push and open a Pull Request

---

## 📄 License

MIT © [scrawl-labs](https://github.com/scrawl-labs)

---

<p align="center">
  Built with curiosity. Powered by code. Driven by a love for CS.
</p>
