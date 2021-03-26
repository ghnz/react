import styled from "styled-components";

export const EditRelease = styled.div`
    .fileTarget {
        border-style: dashed;

        & > div {
            width: 260px;
            margin: 2em auto;
            text-align: center;

            .fpds-Icon--medium {
                font-size: 59px;
                color: #e6e6e6;
            }
        }

        &.drag-over,
        &:hover,
        &:focus {
            border-color: #0074bc;
            background-color: #f0faff;

            & > div {
                .fpds-Icon--medium {
                    color: #0074bc;
                }
            }
        }

        &.drag-reject {
            border-color: red;
            background-color: pink;

            & > div {
                .fpds-Icon--medium {
                    color: red;
                }
            }
        }
    }

    table {
        tbody {
            td {
                &:first-child {
                    width: 40%;
                }
                &:nth-child(2) {
                    width: 100px;
                }
                &:nth-child(3) {
                    width: 15%;
                }
                &:nth-child(4) {
                    width: 20%;
                }
                &:nth-child(5) {
                    width: 40px;
                }
            }
        }
    }

    .countryCheckbox {
        width: 16em;
    }

    .language-dropdown {
        width: 250px;
    }

    .unsavedChanges {
        display: inline-block;
        line-height: 32px;
        vertical-align: middle;
    }

    time {
        margin-left: 0.4em;
        margin-right: 0.4em;
    }

    .fpds-Card {
        position: relative;

        .spinnerOverlay {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            border-radius: 4px;
            background: #fff;
            z-index: 1000;
        }
    }
`;
