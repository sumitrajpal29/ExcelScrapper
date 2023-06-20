import React from 'react';

const App = ({ handleView }) => {
    return (
        <div className='navbar'>
            <ul>
                <li><button onClick={() => handleView('Home')}>Home</button></li>
                <li><button onClick={() => handleView('Trash')}>Trash</button></li>
                <li><button onClick={() => handleView('Upload')}>Upload</button></li>
            </ul>
        </div>
    );
};

export default App;
