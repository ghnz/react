import styled from "styled-components/macro";

const ComboBox = styled.div`
    &.allSelected {
        .fpds-Menu-itemOption {
            &:not(.is-selected) {
                .fpds-Menu-itemCheckbox {
                    &::before {
                        background-color: #eaeaea;
                        border-color: transparent;
                    }
                    &::after {
                        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M7.09 12.41a1 1 0 01-.71-.29L2.8 8.54a1 1 0 010-1.42 1 1 0 011.41 0L7 9.91 11.71 4a1 1 0 011.57 1.24L7.87 12a1 1 0 01-.73.38z' fill='%23a7a7a7'/%3E%3C/svg%3E");
                        visibility: visible;
                    }
                }
            }
        }
    }

    &.has-error .fpds-ComboBox-trigger:not(:disabled) {
        border-color: #9d261d;
    }
`;

export { ComboBox };
