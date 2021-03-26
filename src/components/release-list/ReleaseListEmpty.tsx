import React, { FC } from "react";
import * as styles from './ReleaseList.style';
import Release from 'types/Release';

interface ReleaseListEmptyProps {
	releases: Release[];
	columns: number;
}

export const ReleaseListEmpty: FC<ReleaseListEmptyProps> = (props) => {
	return <React.Fragment>
		{props.releases.length === 0 &&
			<tr><td colSpan={props.columns}>
				<styles.NoReleasesWrapper>
					<styles.NoReleasesContainer>
						{props.children}
					</styles.NoReleasesContainer>
				</styles.NoReleasesWrapper>
			</td></tr>}
	</React.Fragment>;
};
