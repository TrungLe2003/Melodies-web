import ACPrivacyIcon from "../../../src/assets/setAccount/AccountPrivacyIcon";
//
import { useNavigate } from "react-router-dom";

const SetAccountMainPage = () => {
  const nav = useNavigate();
  return (
    <div className="content">
      <div className="setAccountFrame CategoryFrame">
        <h2>Your account</h2>
        <div className="frameRow">
          <div className="titleFrame">
            <div className="iconFrame">
              <ACPrivacyIcon></ACPrivacyIcon>
            </div>
            <div className="title">Account Privacy</div>
          </div>
          <div className="toPage">
            <button onClick={() => nav("/account/accountPrivacy")}>To</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetAccountMainPage;
