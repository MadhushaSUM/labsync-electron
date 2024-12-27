import { Button } from "antd";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";

type ToggleThemeButtonProps = {
    darkTheme: boolean;
    toggleTheme: () => void;
}

const ToggleThemeButton = ({ darkTheme, toggleTheme }: ToggleThemeButtonProps) => {
    return (
        <div className="toggle-theme-btn">
            <Button onClick={toggleTheme}>
                {darkTheme ? <HiOutlineMoon /> : <HiOutlineSun />}
            </Button>
        </div>
    )
}

export default ToggleThemeButton;