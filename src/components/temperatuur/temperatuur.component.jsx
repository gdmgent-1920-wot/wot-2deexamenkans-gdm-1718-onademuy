import React from 'react';
import './temperatuur.styles.scss';
import firebase from '../../firebase';

class Temperatuur extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            temperatures: [],
        }
    }
    /*componentDidMount() {
        firebase
        .firestore()
        .collection("temperatuur").doc("2cOJQ2xdZRPQqqas64S1")
        .get()
        .then(function(doc) {
            if (doc.exists) {
                console.log(doc.data().graden);
                this.setState({temperatuur: doc.data().graden})
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }*/

    componentDidMount() {
        var temperatures = [];
        firebase
        .firestore()
        .collection("temperatuur")
        .get()
        .then((querySnapshot) => {  
            querySnapshot.forEach(function(doc) {
                temperatures.push(doc.data());
            });
            this.setState({ temperatures: temperatures });   
        });
    }

    render(){
        const {temperatures} = this.state;
        return(
            <div className='temperatuur'>
                {temperatures && temperatures.length > 0 && temperatures.map(item => (
                    <div className="titlebig">
                        {Math.round(item.graden)}°
                    </div>
                ))}
                <div className="omschrijving">Temperatuur</div>
            </div>
        );
    }
}

export default Temperatuur;

