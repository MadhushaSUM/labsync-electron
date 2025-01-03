import CRPForm from "./CRPForm";
import FBCForm from "./FBCForm";
import FBSForm from "./FBSForm";
import LipidProfileForm from "./LipidProfileForm";
import UFRForm from "./UFRForm";


const formMapper: { [key: number]: React.ComponentType<{ data: DataEmptyTests, clearScreen: () => void }> } = {
    1: FBSForm,
    2: FBCForm,
    3: LipidProfileForm,
    4: UFRForm,
    5: CRPForm,    
};

export default formMapper;
