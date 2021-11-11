import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound"

function App() {
  return (
    <div className="Home">
      <BrowserRouter>
         <Switch>

           <Route path="/" exact component= { Home } />
           <Route component= { NotFound } />

         </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
