import React from 'react';
import * as DropdownButton from './dropdown_button';
import './App.scss';


const App = () => {
    const handleButtonClick = (e) => {
        console.log(e.target.id);
    };

    const execute = (selection) => {
        console.log('execute %s', selection);
    }

    return (
        <div className="App">
            <DropdownButton.Immediate label={<i>Hello</i>}>
                <button id="item1" className="menu-item" onClick={handleButtonClick}>Item 1</button>
                <button id="item2" className="menu-item" onClick={handleButtonClick}>Item 2</button>
            </DropdownButton.Immediate>
            <DropdownButton.Selected
                labels={{
                    item1: <i>Item 1</i>,
                    item2: 'Item 2',
                }}
                execute={execute}
            >
                <button id="item1" className="menu-item">Item 1</button>
                <button id="item2" className="menu-item">Item 2</button>
            </DropdownButton.Selected>
        </div>
    );
}

export default App;
