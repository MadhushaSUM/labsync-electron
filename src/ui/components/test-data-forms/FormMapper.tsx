import FBCForm from "./FBCForm";
import FBSForm from "./FBSForm";


const formMapper: { [key: number]: React.ComponentType<{ data: DataEmptyTests, clearScreen: () => void }> } = {
    1: FBSForm,
    2: FBCForm,
};

export default formMapper;
