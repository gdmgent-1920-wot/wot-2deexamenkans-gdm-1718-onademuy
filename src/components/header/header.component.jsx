import React from 'react';
import './header.styles.scss';
import firebase from '../../firebase';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hour: null,
            users: [],
        }
    }

    componentDidMount() {
        this.getHour();

        var users = [];
        firebase
        .firestore()
        .collection("user")
        .get()
        .then((querySnapshot) => { 
            querySnapshot.forEach(function(doc) {
                users.push(doc.data());
            });
            this.setState({ users: users });   
        });

        /*var docRef = firebase.firestore().collection("user").doc("PUN4hGQNboe1nN5VyUoc");
        docRef.get().then(function(doc) {
            if (doc.exists) {
                var naam = doc.data().name;
                console.log("user:", naam);
                this.setState({user: naam});
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });*/
    }
    
    getHour = () => {
        const date = new Date();
        const hour = date.getHours()
        this.setState({
           hour
        });
    }

    render(){        
        const {hour, users} = this.state;
        return (
          <div className='header'>
            <div className='aanspreking'>
                {hour < 11 && hour > 5 ? `Goedemorgen ` 
                : hour >= 11 && hour < 17 ? `Goedemiddag ` 
                : `Goedeavond ` }
            </div>
            <div className='naam'>
            {users && users.length > 0 && users.map(item => (
                <p>{item.name}</p>
            ))}
            </div>
          </div>
        );
    }
}

export default Header;
