import CRPForm from "./CRPForm";
import DengueTestForm from "./DengueTestForm";
import ESRForm from "./ESRForm";
import FBCForm from "./FBCForm";
import FBSForm from "./FBSForm";
import HCGForm from "./HCGForm";
import LipidProfileForm from "./LipidProfileForm";
import OTPTForm from "./OTPTForm";
import UFRForm from "./UFRForm";


const formMapper: { [key: number]: React.ComponentType<{ data: DataEmptyTests, clearScreen: () => void }> } = {
    1: FBSForm,
    2: FBCForm,
    3: LipidProfileForm,
    4: UFRForm,
    5: CRPForm,    
    6: ESRForm,
    7: OTPTForm,
    8: HCGForm,
    9: DengueTestForm,
};

export default formMapper;
