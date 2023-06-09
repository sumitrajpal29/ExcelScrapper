import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import DataComponent from './DataComponent';
import TrashComponent from './TrashComponent';
import UploadComponent from './UploadComponent';

const App = ({ handleView }) => {
    return (
        <div className='navbar'>
            <ul>
                <li><button onClick={() => handleView('Home')}>Home</button></li>
                <li><button onClick={() => handleView('Trash')}>Trash</button></li>
                <li><button onClick={() => handleView('Upload')}>Upload</button></li>
            </ul>

            
            {/* <Router>
                <div>
                    <Switch>
                        <Route path="/" exact>
                            <DataComponent />
                        </Route>
                        <Route path="/upload">
                            <UploadComponent />
                        </Route>
                        <Route path="/trash">
                            <TrashComponent />
                        </Route>
                    </Switch>
                </div>
            </Router> */}

        </div>
    );
};

export default App;
