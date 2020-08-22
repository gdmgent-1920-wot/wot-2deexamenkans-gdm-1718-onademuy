import React from 'react';
import './waterniveau.styles.scss';
import firebase from '../../firebase';

class Waterniveau extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boodschappen: [],
            stopzetten: null,
        }
    }

    componentDidMount() {
        var boodschappen = [];
        firebase
        .firestore()
        .collection("boodschap")
        .get()
        .then((querySnapshot) => {  //Notice the arrow funtion which bind `this` automatically.
            querySnapshot.forEach(function(doc) {
                boodschappen.push(doc.data());
            });
            this.setState({ boodschappen: boodschappen });   //set data in state here
            this.setState({stopzetten: this.state.boodschappen[0].manueleStop})
        });
    }

    render(){
        //make de error pinking
        const {stopzetten} = this.state;
        return(
            <div>
                    {stopzetten === false ? 
                        <div className='waterniveau green'>
                            <div className="title">WATERTOEVOER</div>
                            <div className="omschrijving">STATUS: Systeem is ingeschakeld </div>
                        </div>
                    : stopzetten === true ? 
                        <div className='waterniveau red'>
                            <div className="title">WATERTOEVOER</div>
                            <div className="omschrijvingwhite">STATUS: Systeem is uitgeschakeld </div>
                        </div> 
                    :
                        <div className='waterniveau grey'>
                            <div className="title">WATERTOEVOER</div>
                            <div className="omschrijving">ERROR: Controleer de verbinding </div>
                        </div> 
                    }
            </div>
        );
    }
}

export default Waterniveau;
