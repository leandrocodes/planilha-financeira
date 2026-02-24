# FinSpace ⬛️🧊

**FinSpace** is a modern, responsive personal finance dashboard built with React and Firebase. It features a striking **Neo-Brutalist aesthetic**, leveraging large geometric typography, vibrant stark colors, and high-contrast drop shadows. It is designed specifically to make financial consolidation powerful, secure, and visually unmistakable.

## 🌟 Features
- **Cross-Platform Responsive:** Desktop-class data-dense layout combined with a fluid, finger-friendly mobile experience including Bottom Navigation and Floating Action Buttons (FABs).
- **Brutalist UI:** A brave departure from "clean SaaS" looks — FinSpace uses the **Unbounded** geometric display font, heavy borders, deep structural shadows, and unapologetic UI geometry.
- **Realtime Firebase Database:** Instant state synchronization across your devices through Firestore `onSnapshot`.
- **Granular Control:** Separates incomes from fixed and variable expenses gracefully inside a smooth, motion-driven Monthly View.

---

## 🛠 Tech Stack
- **Framework:** [React 19](https://reactjs.org/) (Vite)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Styling:** [TailwindCSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Database / Auth:** [Firebase](https://firebase.google.com/) (Firestore)
- **Formatting:** [Biome](https://biomejs.dev/)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/planilha-financeira.git
cd planilha-financeira
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Firebase
You will need your own Firebase project to hook up the database.
1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore Database**.
3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
4. Fill inside the `.env` file with your specific Firebase Project credentials.

> ⚠️ **IMPORTANT**: For production, ensure you set up secure Firebase Security Rules instead of global read/write access!

### 4. Run the Development Server
```bash
npm run dev
```

The app will be available locally, usually on `http://localhost:5173`.

---

## 📂 Project Structure (FSD)
The project directory follows a simplified variation of **Feature-Sliced Design (FSD)**:
- `src/app/`: Global configurations, main layout, and root CSS.
- `src/pages/`: Full-page route components (Dashboard, MonthlyView).
- `src/widgets/`: Independent, complex layout blocks (Sidebar, BottomNav).
- `src/features/`: Reusable chunked app features (ManageTransactionModal logic).
- `src/entities/`: Domain-specific business logic and Firebase connectors (`Transaction` model).
- `src/shared/`: Shared universal generic UI components (Buttons, Cards).

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
