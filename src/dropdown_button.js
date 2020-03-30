import React from 'react';
import PropTypes from 'prop-types';
import './dropdown_button.scss';


/**
 * <DropdownButton.type>
 *     label={text, number, component}
 *     css={CSS classes for button}
 * >
 * </DropdownButton.type>
 *
 * Types:
 * immediate: Click anywhere in button to drop down; select item immediately executes.
 * selection: Click main button to execute; click arrow to drop down menu; selection retitles button.
 */


const icons = {
    chevronDown: style => <svg id="Chevron Down" data-name="Chevron Down" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 249 124" style={style}><polygon points="249,57 124.5,124 0,57 0,0 124.5,67 249,0" /></svg>,
    chevronUp: style => <svg id="Chevron Up" data-name="Chevron Up" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 249 124" style={style}><polygon points="249,67 124.5,0 0,67 0,124 124.5,57 249,124" /></svg>,
};


/**
 * Handle the triggering mechanism for dropdown buttons, including reacting to clicks on the
 * button trigger and reacting to mouse/keyboard events.
 * @param
 * children {object} Components/elements inside <DropdownButton> tags.
 *
 * @return
 * dropdownOpen {bool} True if the dropdown is currently open
 * handleTrigger {func} Call when the trigger button is clicked.
 * handleKey {func} Call when the user presses a key relevant to the trigger button.
 * closeDropdown {function} Call to close the dropdown menu.
 * wrappedChildren {elements} `children` but wrapped in <li> elements.
 */
const useDropdownButton = (children) => {
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    let timer = null;

    // Called when the user clicks on the button to show or hide the dropdown menu.
    const handleTrigger = (e) => {
        e.nativeEvent.stopImmediatePropagation();
        setDropdownOpen(!dropdownOpen);
    };

    // Close the menu if an item on the menu was clicked.
    const closeDropdown = (e) => {
        e.stopPropagation();
        setDropdownOpen(false);
    };

    // Close the menu if ESC key pressed.
    const handleKey = (e) => {
        if (e.keyCode === 27) {
            closeDropdown(e);
        }
    };

    // 
    const handleMouseEnter = (e) => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    }

    const houseMouseLeave = (e) => {
        timer = setTimeout(() => {
            timer = null;
            setDropdownOpen(false);
        }, 1000);
    }

    React.useEffect(() => {
        // Add a click handler to the DOM document to close dropdown on click outside menu.
        document.addEventListener('click', closeDropdown);
        return () => {
            document.removeEventListener('click', closeDropdown);
        };
    }, []);

    return [
        // state
        {
            dropdownOpen,
        },
        // actions
        {
            handleTrigger,
            handleKey,
            handleMouseEnter,
            houseMouseLeave,
            closeDropdown,
        },
    ];
}


export const Immediate = ({ label, css, inline, children }) => {
    const [state, actions] = useDropdownButton(children);
    console.log('IMM %o\n%o', state, actions);

    // Wrap each child in an <li> element, as they will be children of a <ul>.
    const wrappedChildren = React.Children.map(children, child => (
        <li>{React.cloneElement(child)}</li>
    ));

    return (
        <div className={`dropdown-button${css ? ` ${css}` : ''}`} style={inline ? { display: 'inline-flex' } : null}>
            <button
                className="btn"
                onClick={actions.handleTrigger}
                onKeyUp={actions.handleKey}
                onMouseEnter={actions.handleMouseEnter}
                onMouseLeave={actions.houseMouseLeave}
            >
                {label}
            </button>
            {state.dropdownOpen ?
                <ul
                    className="dropdown-button__content"
                    onClick={actions.closeDropdown}
                    onMouseEnter={actions.handleMouseEnter}
                    onMouseLeave={actions.houseMouseLeave}
                >
                    {wrappedChildren}
                </ul>
            : null}
        </div>
    );
};

Immediate.propTypes = {
    /** Label to display in the button */
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.element,
    ]).isRequired,
    /** Called when user clicks label part of button */
    execute: PropTypes.func.isRequired,
    /** CSS styles for the button itself */
    css: PropTypes.string,
    /** True to make this an inline component */
    inline: PropTypes.bool,
};

Immediate.defaultProps = {
    css: '',
    inline: false,
};


export const Selected = ({ label, css, inline, children }) => {
    const [state, actions] = useDropdownButton(children);

    // Wrap each child in an <li> element, as they will be children of a <ul>.
    const labelIds = [];
    const wrappedChildren = React.Children.map(children, child => {
        labelIds.push(child.props.id);
        return <li>{React.cloneElement(child)}</li>
    });
    console.log(labelIds);

    return (
        <div className={`dropdown-button${css ? ` ${css}` : ''}`} style={inline ? { display: 'inline-flex' } : null}>
            <button
                className="btn"
                onClick={actions.handleTrigger}
                onKeyUp={actions.handleKey}
                onMouseEnter={actions.handleMouseEnter}
                onMouseLeave={actions.houseMouseLeave}
            >
                {label}
            </button>
            {state.dropdownOpen ?
                <ul
                    className="dropdown-button__content"
                    onClick={actions.closeDropdown}
                    onMouseEnter={actions.handleMouseEnter}
                    onMouseLeave={actions.houseMouseLeave}
                >
                    {wrappedChildren}
                </ul>
            : null}
        </div>
    );
};

Immediate.propTypes = {
    /** Labels to display in the execution part of button */
    label: PropTypes.object.isRequired,
    /** Called when user clicks execution part of button */
    execute: PropTypes.func.isRequired,
    /** CSS styles for the button itself */
    css: PropTypes.string,
    /** True to make this an inline component */
    inline: PropTypes.bool,
};

Immediate.defaultProps = {
    css: '',
    inline: false,
};
