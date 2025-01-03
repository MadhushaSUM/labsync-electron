import FBCForm from "./FBCForm";
import FBSForm from "./FBSForm";
import LipidProfileForm from "./LipidProfileForm";


const formMapper: { [key: number]: React.ComponentType<{ data: DataEmptyTests, clearScreen: () => void }> } = {
    1: FBSForm,
    2: FBCForm,
    3: LipidProfileForm,
};

export default formMapper;
