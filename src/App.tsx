import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import JournalForm from './pages/JournalForm'
import JournalList from './pages/JournalList'

function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journal/:type" element={<JournalForm />} />
        <Route path="/list" element={<JournalList />} />
      </Routes>
    </div>
  )
}

export default App