import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useEffect, useState } from "react";
const useTheme = () => {
	let themes = ["light", "dark"];
	let icons = [<Brightness4Icon />, <Brightness7Icon />];
	const [icon, setIcon] = useState(<Brightness7Icon />);
	let [theme, setTheme] = useState("light");
	let changeTheme = () => {
		let index = themes.indexOf(theme);
		if (index === themes.length - 1) {
			setTheme(themes[0]);
			setIcon(icons[0]);
		} else {
			setTheme(themes[index + 1]);
			setIcon(icons[index + 1]);
		}
	};
	useEffect(() => {}, [theme]);
	return [theme, <div onClick={changeTheme}>{icon}</div>];
};

export default useTheme;
