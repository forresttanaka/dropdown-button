import React from 'react';
import PropTypes from 'prop-types';
import './dropdown_button.scss';


const icons = {
    chevronDown: <svg id="Chevron Down" data-name="Chevron Down" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 249 124"><polygon points="249,57 124.5,124 0,57 0,0 124.5,67 249,0" /></svg>,
    chevronUp: <svg id="Chevron Up" data-name="Chevron Up" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 249 124"><polygon points="249,67 124.5,0 0,67 0,124 124.5,57 249,124" /></svg>,
};


/**
 * This module implements two types of buttons that contain dropdown menus:
 *
 * 1. Immediate: Clicking the button opens a dropdown menu with multiple items. Clicking one of the
 *    items causes an immediate action to occur.
 *
 * <DropdownButton.Immedate>
 *     label={text, number, component that forms the button's label}
 *     css={optional CSS classes for button}
 *     inline={optional boolean; true to give the button an inline CSS style}
 * >
 *     <first dropdown item>
 *     <second dropdown item>
 *     <...>
 * </DropdownButton.Immedate>
 *
 * The child components each make a clickable dropdown item which you can manage any way you'd
 * like. A very typical way involves using buttons with ids and each having the same click handler:
 *
 * <DropdownButton.Immediate label={<i>Click here</i>}>
 *     <button id="first" onClick={handleClick}>First</button>
 *     <button id="second" onClick={handleClick}>Second</button>
 * </DropdownButton.Immedate>
 *
 * The `handleClick` callback would then extract the id of the clicked button to determine what
 * action to take, or each button could get its own click handler.
 *
 * 2. Selected: The button has two sections -- a label and a trigger. Clicking the trigger makes a
 *    dropdown appear with selections you define. Clicking those selections doesn't cause any
 *    action to occur besides changing the label of the button to the selection. Clicking the label
 *    then performs the selected action.
 *
 * <DropdownButton.Selected
 *     labels={object with id of each dropdown item and corresponding label text, number, component}
 *     execute={callback with the id of the current selected dropdown item id}
 *     id={HTML id to assign to trigger button}
 *     triggerVoice={text for screen reader to say while trigger button focused}
 *     css={optional CSS classes for button}
 *     inline={optional boolean; true to give the button an inline CSS style}
 * >
 *     <first dropdown item with first id>
 *     <second dropdown item with second id>
 *     <...>
 * </DropdownButton.Selected>
 *
 * The `labels` property connects the button's label with a dropdown item through an id, e.g.:
 *
 * labels={{ first: 'First item', second: <b>Second item</b> }}
 *
 * Clicking the dropdown item component causes the label of the button to change to the label
 * object's property with the id matching the clicked item:
 *
 * <DropdownButton.Selected
 *     labels={{ first: 'First item', second: <b>Second item</b> }}
 *     execute={handleExecute}
 *     id="example-id"
 *     triggerVoice="Dropdown options"
 * >
 *     <button id="first">The first item in the dropdown</button>
 *     <button id="second">The second item in the dropdown</button>
 * </DropdownButton.Selected>
 *
 * Clicking the button with id "second" changes the label of the button to the `labels` object
 * property with the key "second," which changes the label to "Second item" in bold. Notice the
 * button's contents don't need to match the corresponding label. Do not attach click handlers to
 * each dropdown item component because a click handler gets automatically assigned to each.
 *
 * The function you pass in the `execute` property gets called when the user clicks the label
 * portion of the button, with the single parameter containing the id of the currently selected
 * dropdown item (i.e. the id of the current button label).
 */


/**
 * Handle the triggering mechanism for dropdown buttons, including reacting to clicks on the
 * button trigger and reacting to mouse/keyboard events.
 * @param
 * children {object} Components/elements inside <DropdownButton> tags.
 *
 * @return
 * state.dropdownOpen {bool} True if the dropdown is currently open
 * actions.handleTrigger {func} Call when the trigger button is clicked.
 * actions.handleKey {func} Call when the user presses a key relevant to the trigger button.
 * actions.handleMouseEnter {func} Call when the mouse enters the trigger or dropdown.
 * actions.handleMouseLeave {func} Call when the mouse leaves the trigger or dropdown.
 * actions.closeDropdown {func} Call to close the dropdown.
 */
const useDropdownButton = () => {
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    let timer = null;

    // Called when the user clicks on the button to show or hide the dropdown.
    const handleTrigger = (e) => {
        e.nativeEvent.stopImmediatePropagation();
        setDropdownOpen(!dropdownOpen);
    };

    // Close the menu in reaction to a user event.
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

    // Called when the mouse enters an element. Clears the timer if running.
    const handleMouseEnter = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    // Called when the mouse leaves an element. Starts a timer to close the menu if no further
    // action.
    const handleMouseLeave = () => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = null;
            setDropdownOpen(false);
        }, 1000);
    };

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
            handleMouseLeave,
            closeDropdown,
        },
    ];
};


/**
 * Implements the immediate form of dropdown button, where selecting an item from the dropdown menu
 * immediately executes that item.
 */
export const Immediate = ({ label, id, css, inline, children }) => {
    const [state, actions] = useDropdownButton();

    // Wrap each child in an <li> element, as they will be children of a <ul>.
    const wrappedChildren = React.Children.map(children, child => (
        <li>{React.cloneElement(child)}</li>
    ));

    return (
        <div className={`dropdown-button${css ? ` ${css}` : ''}`} style={inline ? { display: 'inline-flex' } : null}>
            <button
                className="btn"
                onClick={actions.handleTrigger}
                id={id}
                aria-haspopup="true"
                aria-expanded={state.dropdownOpen}
                onKeyUp={actions.handleKey}
                onMouseEnter={actions.handleMouseEnter}
                onMouseLeave={actions.handleMouseLeave}
            >
                {label}
                {icons.chevronDown}
            </button>
            {state.dropdownOpen ?
                <ul
                    aria-labelledby={id}
                    className="dropdown-button__content"
                    onMouseEnter={actions.handleMouseEnter}
                    onMouseLeave={actions.handleMouseLeave}
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
    /** id of this control that's unique on the page */
    id: PropTypes.string.isRequired,
    /** CSS styles for the wrapper div */
    css: PropTypes.string,
    /** True to make this an inline component */
    inline: PropTypes.bool,
    /** Child components within in this component */
    children: PropTypes.node.isRequired,
};

Immediate.defaultProps = {
    css: '',
    inline: false,
};


/**
 * Implements the selected form of the dropdown button, where items in the dropdown menu select the
 * action taken when the button is clicked.
 */
export const Selected = ({ labels, execute, id, triggerVoice, css, inline, children }) => {
    const [state, actions] = useDropdownButton();

    // Extract the id attributes of each of the child components.
    const labelIds = React.Children.map(children, child => child.props.id);

    // Currently selected dropdown item id; initialized to first item.
    const [selection, setSelection] = React.useState(labelIds[0]);

    // Called when the user clicks a dropdown item.
    const handleItemClick = (e) => {
        setSelection(e.target.id);
    };

    // Wrap each child in an <li> element, as they will be children of a <ul>. Add this component's
    // click handler.
    const wrappedChildren = React.Children.map(children, child => (
        <li>{React.cloneElement(child, { onClick: handleItemClick })}</li>
    ));

    // Called when the user clicks the label portion of the button.
    const handleExecute = () => {
        execute(selection);
    };

    return (
        <div className={`dropdown-button${css ? ` ${css}` : ''}`} style={inline ? { display: 'inline-flex' } : null}>
            <div className="dropdown-button__composite" onMouseEnter={actions.handleMouseEnter} onMouseLeave={actions.houseMouseLeave}>
                <button
                    className="dropdown-button__composite-execute"
                    onClick={handleExecute}
                    onKeyUp={actions.handleKey}
                    onMouseEnter={actions.handleMouseEnter}
                    onMouseLeave={actions.handleMouseLeave}
                >
                    {labels[selection]}
                </button>
                <button
                    className="dropdown-button__composite-trigger"
                    onClick={actions.handleTrigger}
                    id={id}
                    aria-haspopup="true"
                    aria-expanded={state.dropdownOpen}
                    aria-label={triggerVoice}
                    onKeyUp={actions.handleKey}
                    onMouseEnter={actions.handleMouseEnter}
                    onMouseLeave={actions.handleMouseLeave}
                >
                    {icons.chevronDown}
                </button>
            </div>
            {state.dropdownOpen ?
                <ul
                    aria-labelledby={id}
                    className="dropdown-button__content"
                    onMouseEnter={actions.handleMouseEnter}
                    onMouseLeave={actions.handleMouseLeave}
                >
                    {wrappedChildren}
                </ul>
            : null}
        </div>
    );
};

Selected.propTypes = {
    /** Labels to display in the execution part of button */
    labels: PropTypes.object.isRequired,
    /** Called when user clicks execution part of button */
    execute: PropTypes.func.isRequired,
    /** id of this control that's unique on the page */
    id: PropTypes.string.isRequired,
    /** Text for screen readers to say when focusing on dropdown trigger */
    triggerVoice: PropTypes.string.isRequired,
    /** CSS styles for the wrapper div */
    css: PropTypes.string,
    /** True to make this an inline component */
    inline: PropTypes.bool,
    /** Child components within in this component */
    children: PropTypes.node.isRequired,
};

Selected.defaultProps = {
    css: '',
    inline: false,
};
