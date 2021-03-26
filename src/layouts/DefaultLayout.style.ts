import styled from "styled-components";
import LayoutMode from "../enums/LayoutMode";

type StyleProps = {
    mode: LayoutMode;
};

const getBackgroundColorByMode = ({ mode }: StyleProps) => {
    switch (mode) {
        case LayoutMode.admin:
            return "#F9F9F9";
        default:
            return "white";
    }
};

const LayoutWrapper = styled.div<StyleProps>`

    background-color: ${getBackgroundColorByMode};

`;

const BodyContentArea = styled.div`
    margin-top: 0px;
`;

const TheContainer = styled.div`
    background-color: #eaeaea;
`;

export { LayoutWrapper, BodyContentArea, TheContainer };
