import styled from "styled-components/macro";

const DatePicker = styled.div`
    .datePickerWrapper {
        display: block;
        width: 100%;
        .react-datepicker-wrapper {
            width: 100%;
            display: block;
        }
    }

    .react-datepicker-popper {
        width: 100%;
        max-width: 350px;
        .react-datepicker {
            display: flex;
            .react-datepicker__month-container {
                flex: 5;
                .react-datepicker__header {
                    background-color: white;
                    border-bottom: none;
                    .react-datepicker__current-month {
                        margin-bottom: 13px;
                    }
                    .react-datepicker__day-names {
                        display: flex;
                        .react-datepicker__day-name {
                            flex: 1;
                            text-transform: uppercase;
                            color: #6a6a6a;
                        }
                    }
                }
                .react-datepicker__month {
                    display: flex;
                    flex-direction: column;
                    .react-datepicker__week {
                        display: flex;
                        .react-datepicker__day {
                            flex: 1;
                        }
                    }
                }
            }
            .react-datepicker__time-container {
                flex: 1;
            }
        }

		.react-datepicker__triangle {
			display: none;
		}
    }
`;

export { DatePicker };
