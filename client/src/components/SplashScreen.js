/* @author Elven Li */

import playlisterLogo from './images/playlisterLogo.png';
import Copyright from './Copyright'

export default function SplashScreen() {
    return (
        <div id="splash-screen">
            <img src={playlisterLogo} alt="playlisterLogo"/>
            <div>{"\n"}Magical moments are created with music, create a moment today</div>

            <Copyright sx={{ mt: 5, transform:"translate(0%,2500%)"}} />
        </div>
    )
}