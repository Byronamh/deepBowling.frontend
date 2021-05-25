import React from 'react';
import './styles.css';

class Loader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={"loader " + (this.props?.loading ? '' : 'd-none')}>
                <div>
                    <div className="lds-dual-ring" />

                    <h4>
                        {this.props.message}
                    </h4>
                </div>
            </div>
        )
    };
}

export default Loader;