import CRPForm from "./CRPForm";
import DengueTestForm from "./DengueTestForm";
import ESRForm from "./ESRForm";
import FBCForm from "./FBCForm";
import FBSForm from "./FBSForm";
import HBForm from "./HBForm";
import HCGForm from "./HCGForm";
import LipidProfileForm from "./LipidProfileForm";
import OTPTForm from "./OTPTForm";
import RHFactorForm from "./RHFactorForm";
import SCalciumForm from "./SCalcium";
import UFRForm from "./UFRForm";
import WBCDCForm from "./WBCDCForm";
import SElectrolyteForm from "./SElectrolytes.tsx";
import OralGlucoseForm from "./OralGlucoseForm.tsx";
import PPBSForm from "./PPBSForm.tsx";
import SFRForm from "./SFRForm.tsx";
import LFTForm from "./LFTForm.tsx";
import SCreatinineForm from "./SCreatinineForm.tsx";
import BloodUreaForm from "./BloodUreaForm.tsx";
import SProteinsForm from "./SProteinsForm.tsx";
import BilirubinForm from "./BilirubinForm.tsx";
import SAlkPhosphataseForm from "./SAlkPhosphataseForm.tsx";
import SCholesterolForm from "./SCholesterol.tsx";
import GammaGTForm from "./GammaGTForm.tsx";
import RBSForm from "./RBSForm.tsx";


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
    10: HBForm,
    11: WBCDCForm,
    12: RHFactorForm,
    13: SCalciumForm,
    14: SElectrolyteForm,
    15: OralGlucoseForm,
    16: PPBSForm,
    17: SFRForm,
    18: LFTForm,
    19: SCreatinineForm,
    20: BloodUreaForm,
    21: SProteinsForm,
    22: BilirubinForm,
    23: SAlkPhosphataseForm,
    24: SCholesterolForm,
    25: GammaGTForm,
    26: RBSForm,
};

export default formMapper;
