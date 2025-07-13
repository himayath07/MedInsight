# 🏥 Medical Assistant

> A modern, mobile-friendly health management app for medication tracking, reminders, and diagnostic centre discovery.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## ✨ Key Features

- **Medication Management**
  - Add, edit, and delete medications with custom schedules
  - Mark medications as taken or skipped; view persistent history/log
  - Smart browser notifications with sound feedback (chime) and logo icon
  - Fully mobile responsive UI for easy use on any device

- **Diagnostic Centres**
  - Browse top Indian cities and view real diagnostic centre data (loaded from CSV)
  - See name, location, address, services, timings, and contact for each centre
  - Touch-friendly, responsive cards and buttons

- **Navigation & Branding**
  - Custom logo in navbar and browser tab (favicon)
  - Hamburger menu for mobile navigation
  - Consistent, modern design with dark/light mode

- **Other Features**
  - Animated, engaging landing page
  - Symptom checker and AI analysis (if enabled)
  - All data (medications, history) persisted in browser storage

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ & npm 6+
- Modern web browser

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/himayath07/medical-assistant.git
   cd medical-assistant/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Diagnostic Centre Data
- Place your diagnostic centre CSV at `frontend/public/diagnostic_centres.csv` (see sample format in repo).
- The app will automatically load and display real data from your CSV.

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ & npm 6+
- Modern web browser

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/himayath07/medical-assistant.git
   cd medical-assistant/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠 Built With

- **Frontend**: React 18, Vite 4
- **Styling**: Tailwind CSS 3
- **UI Components**: ShadCN UI
- **Icons**: Lucide Icons
- **State Management**: React Context API
- **Routing**: React Router 6

## 📱 Core Features

### Medication Management
- Add, edit, and delete medications
- Set custom dosages and schedules
- Track medication inventory

### Smart Reminders
- Browser notifications
- Customizable reminder times
- Snooze functionality

### Symptom Tracker
- Record and monitor symptoms
- View symptom history
- Get health insights

## 📂 Project Structure

```
frontend/
├── public/           # Static assets
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Application pages
│   ├── context/      # React context providers
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions
│   ├── App.jsx       # Main application component
│   └── main.jsx      # Application entry point
```

## 🌐 Browser Support

| Browser | Status |
|---------|--------|
| Chrome  | ✅     |
| Firefox | ✅     |
| Safari  | ✅     |
| Edge    | ✅     |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developed By

**Himayath**  
[GitHub](https://github.com/himayath07)  

