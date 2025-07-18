import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import JournalForm from './pages/JournalForm'
import JournalDetail from './pages/JournalDetail'

function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journal/:type" element={<JournalForm />} />
        <Route path="/journal/:type/edit/:id" element={<JournalForm />} />
        <Route path="/journal/detail/:id" element={<JournalDetail />} />
      </Routes>
    </div>
  )
}

export default App