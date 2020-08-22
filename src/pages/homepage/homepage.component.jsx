import React from 'react';
import './homepage.styles.scss';
import Waterniveau from '../../components/waterniveau/waterniveau.component';
import Verlichting from '../../components/verlichting/verlichting.component';
import Temperatuur from '../../components/temperatuur/temperatuur.component';
import Weer from '../../components/weer/weer.component';
import Instellingen from '../../components/instellingen/instellingen.component';
import Header from '../../components/header/header.component';
import { Link } from 'react-router-dom';

class Homepage extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className='homepage'>
                <Header/>
                <Link to='/waterniveau'>
                    <Waterniveau/>
                </Link>
               <div className="verlTemp">
                    <Verlichting/>
                    <Temperatuur/>
                </div>
                <Weer/>
                <Link to='/instellingen'>
                    <Instellingen/>
                </Link>
            </div> 
        );
    }
}

export default Homepage;