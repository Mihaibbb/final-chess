import './App.css';
import Home from './Components/Home';
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import Account from './Components/Account';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/account" element={<Account />}/>
      </Routes>
    </Router>
  );
}

export default App;
