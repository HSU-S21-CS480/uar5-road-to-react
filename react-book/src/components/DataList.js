import React, {Component} from 'react';

class DataList extends Component {
    render() {
        const {list} = this.props;
        return (
            <React.Fragment>
            <h3> DataList Component</h3>
            {list.map(item => 
                <div key={item.objectID}>
                <span> <a href="item.url"> {item.title} </a></span> 
                <span> {item.author} </span>
                <span> {item.num_comments} </span>
                <span> {item.points} </span>
               </div> 
             )}
            </React.Fragment>
        );
    }
}

export {DataList};
export default DataList;

// everything must have a render function because that is how it works with HTML