import React from 'react';

class FieldWithElement extends React.Component {
    render() {
        return (
            <div className={`mt-3 row d-flex ${this.props.className}`}>
                <div className={`col-md-${this.props.nameCols} name`}>
                    <span className={"text"}>{this.props.name}</span>
                </div>
                <div className={`element col-md-${this.props.elementCols}`}>
                    {this.props.children}
                    <h6 className="t-align-r card-md"
                        style={{fontWeight: 200, color: this.props.errorColor}}>
                        {this.props.errors}
                    </h6>
                </div>
            </div>
        )
    }
}

export default FieldWithElement;