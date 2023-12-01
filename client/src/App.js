import './App.css';
// import baseUrl from "./baseUrl";
// import axios from "axios";
import { React} from "react";
import { Route, Routes} from "react-router-dom";
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store';
import { LoginScreen, SignUpScreen, HomeScreen, PasswordReset, VerifyScreen, ConfirmScreen, EditScreen, ProfilePage } from './components'

function App() {

  return (
    <div className="App">
      <AuthContextProvider>
        <GlobalStoreContextProvider>
            <Routes>
              <Route index element={<HomeScreen />} />
              <Route path="sign-up/" element={<SignUpScreen />} />
              <Route path="login/" element={<LoginScreen />} />
              <Route path="password-reset/" element={<PasswordReset />} />
              <Route path="verify/" element={<VerifyScreen />} />
              <Route path="confirm/" element={<ConfirmScreen />} />
              <Route path="edit/:mapId" element={<EditScreen />} />
              <Route path="profile/:username" element={<ProfilePage />} />
            </Routes>
        </GlobalStoreContextProvider>
      </AuthContextProvider>
      
    </div>
  );
}
/*<Routes>
        <Route index element={<HomeScreen />} />
        <Route path="signup/" element={<SignUpScreen />} />
        <Route path="login/" element={<LoginScreen />} />
        <Route path="password-reset/" element={<PasswordReset />} />
      </Routes>*/
export default App;
