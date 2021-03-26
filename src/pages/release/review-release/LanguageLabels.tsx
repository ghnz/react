import React, { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/reducers";

type Props = {
	cultureCodes: string[] | undefined
}

const LanguageLabels: FC<Props> = ({cultureCodes}) => {

	const languages = useSelector((state: RootState) => state.language.languages);

	if(!languages || !cultureCodes) return <React.Fragment />;

	return <React.Fragment>{cultureCodes.map(c => languages.find(l => l.cultureCode === c)?.name)?.join(', ')}</React.Fragment>
}

export default LanguageLabels;