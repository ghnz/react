import styled from "styled-components";

export const NewReleaseStyle = styled.div`
    .backToDraftReleases {
        display: inline;
        line-height: 16px;
        height: 16px;
        cursor: pointer;

        i,
        span {
            vertical-align: middle;
        }
    }

    hr {
        margin-top: 2em;
    }

    .fpds-Form {
        margin-top: 0;
    }

    .fpds-Form-item {
        &:last-child {
            margin-bottom: 0;
        }
    }
`;
