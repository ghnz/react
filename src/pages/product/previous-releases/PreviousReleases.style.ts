import styled from "styled-components";

const PreviousReleases = styled.div`
  .fpds-Table {
    & > thead {
      & > tr {
        th {
          &:first-child {
            width: 50%;
          }
          &:last-child {
            width: 25%;
          }
        }
      }
    }
  }
`;

export { PreviousReleases };
