import styled from "styled-components";

export const ViewRelease = styled.div`
    .releaseRegion {
        span:not(:last-child):after {
            content: ", ";
        }
    }
`;
