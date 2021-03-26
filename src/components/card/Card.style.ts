import styled from "styled-components";

const CardSection = styled.div`
    margin: 0 -24px;
    padding: 24px;
    border-bottom: 1px solid #ddd;
`;

const CardTable = styled.table`
    margin: -24px;
    width: calc(100% + 48px) !important;
    border-radius: 4px;

    & > thead,
    & > tbody {
        & > tr {
            & > td,
            & > th {
                .fpds-Checkbox {
                    margin: 0;
                }
                &:first-child {
                    padding-left: 23px;
                }
                &:last-child {
                    padding-right: 23px;
                }
            }
        }
    }
`;

const Card = styled.div`
    ${CardSection} {
        &:first-child {
            padding-top: 0;
        }

        &:last-child {
            border: 0;
            padding-bottom: 0;
        }
    }
`;

export { Card, CardSection, CardTable };
