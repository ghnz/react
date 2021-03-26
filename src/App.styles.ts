import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

    label {
        margin: initial;
        &:not(.fpds-Form-itemLabel) {
            font-weight: initial;
        } 
    }

    .selectedFilters {
        > div {
            margin: auto 0;
        }
    }

    .filters {
        width: 320px;
    }

    .directionArrow {
        position: relative;
        top: 2px;
    }

    .fpds-Navbar-brandLink, 
    .fpds-Breadcrumb-itemOption,
    .fpds-Nav-itemOption,
    .fpds-Tabs-itemOption,
    .fpds-Button {
		text-decoration: none !important;

        &::hover, &::active, &::focus {
            text-decoration: none !important;
        }
    }

    .fontSlightlyBold {
        font-weight: 500;
    }


    .fpds-Navbar-brandLink  {
        color: #003a69;
        &:hover {
            color: #003a69;
        }
    }

    .fpds-Button, 
    .fpds-Breadcrumb-itemOption,
    .fpds-Nav-itemOption,
    .fpds-Tabs-itemOption {
        &:not(.fpds-Button--primary, .fpds-Button--danger, .fpds-Button--subtlePrimary, .fpds-Button--subtleDanger) {
            &:hover, &.is-hovered {
                color: #1c1c1c;
            }
        }
    }
    
    .fpds-Button:hover, .fpds-Button.is-hovered {
        color: #0074BC;
    }
    .fpds-Button--primary:hover, .fpds-Button--primary.is-hovered {
        color: white;
    }
    .fpds-Button--danger:hover, .fpds-Button--danger.is-hovered {
        color: white;
    }
    .fpds-Button--subtle:hover, .fpds-Button--subtle.is-hovered {
        color: #1c1c1c;
    }
    .fpds-Button--subtlePrimary:hover, .fpds-Button--subtlePrimary.is-hovered {
        color: #0074bc;
    }
    .fpds-Button--subtleDanger:hover, .fpds-Button--subtleDanger.is-hovered {
        color: #9d261d;
    }
`;

export default GlobalStyle;