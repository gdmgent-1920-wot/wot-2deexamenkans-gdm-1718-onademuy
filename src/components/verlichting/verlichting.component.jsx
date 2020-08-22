import React from 'react';
import './verlichting.styles.scss';
import firebase from '../../firebase';

class Verlichting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            verlichting: null,
            items: [],
        }
    }

    /*componentDidMount() {
        console.log("printing the data");
        firebase
        .firestore()
        .collection("verlichting").doc("OjgC8T12rslWt7J3XbHp")
        .get()
        .then(function(doc) {
            if (doc.exists) {
                console.log(doc.data().aan);
                this.setState({verlichting: doc.data().aan})
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }*/

    componentDidMount() {
        var items = [];
        firebase
        .firestore()
        .collection("verlichting")
        .get()
        .then((querySnapshot) => {  //Notice the arrow funtion which bind `this` automatically.
            querySnapshot.forEach(function(doc) {
                items.push(doc.data());
            });
            this.setState({ items: items });   //set data in state here
            this.setState({verlichting: this.state.items[0].aan});
        });
    }
    
    submit = (e) => {
        e.preventDefault();
        const db = firebase.firestore();
        
        if(this.state.verlichting){
            this.setState({verlichting: false});
            db.collection("verlichting").doc("OjgC8T12rslWt7J3XbHp").update({
                aan: false,
            });

        } else {
            this.setState({verlichting: true});
            db.collection("verlichting").doc("OjgC8T12rslWt7J3XbHp").update({
                aan: true,
            });
        }
    }

    render(){
        return ( 
            <div onClick={this.submit} className= {this.state.verlichting ? "verlichting aan" : "verlichting uit"}>
                {this.state.verlichting === false ?
                    <div className="titlebig">UIT</div>
                :  this.state.verlichting === true ?
                    <div className="titlebig">AAN</div>
                :
                <div className="titlebig">loading</div>
                }

                <div className="omschrijving">Verlichting</div>
            </div>
        );
      }
}

export default Verlichting;


