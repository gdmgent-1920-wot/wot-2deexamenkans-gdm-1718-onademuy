import React from 'react';
import './geschiedenispage.styles.scss';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';

class Geschiedenispage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            allhistory:[],
        }
    }

    componentDidMount() {
        var allhistory = [];
        firebase
        .firestore()
        .collection("watertoevoer").orderBy("datum", "desc")
        .get()
        .then((querySnapshot) => {  //Notice the arrow funtion which bind `this` automatically.
            querySnapshot.forEach(function(doc) {
                allhistory.push(doc.data());
            });
            this.setState({ allhistory: allhistory });   //set data in state here
        });
    }

    render(){
        const {allhistory} = this.state;

        return(
            <div className='instellingenpage'>
                <div className="pagetitle yellow">GESCHIEDENIS</div>
                <div className="back"><Link to='/waterniveau'>Ga terug</Link></div>

            <div className="tablesettings">
                <table>
                    <tr>
                        <th>Datum</th>
                        <th>Wijze</th>
                    </tr>

                    {allhistory && allhistory.length > 0 && allhistory.map(item => (
                         <tr>
                            <td>{JSON.stringify(item.datum.toDate().getDate())}/{JSON.stringify(item.datum.toDate().getMonth())}/{JSON.stringify(item.datum.toDate().getFullYear())} {JSON.stringify(item.datum.toDate().getHours()).padStart(2, "0")}:{JSON.stringify(item.datum.toDate().getMinutes()).padStart(2, "0")}</td>
                            <td>{item.manier}</td>
                        </tr>
                    ))}
                </table>
            </div>
            </div> 
        );
    }
}

export default Geschiedenispage;