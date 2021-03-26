import styled from "styled-components";

export const AllReleases = styled.div`
    .fpds-Table {
        & > thead {
            & > tr {
                th {
                    &:nth-child(1) {
                        width: 35px;
                    }
                    &:nth-child(2) {
                        width: 40%;
                    }
                    &:nth-child(5) {
                        width: 210px;
                    }
                    &:nth-child(6) {
                        width: 80px;
                    }
                }
            }
        }
    }
`;
