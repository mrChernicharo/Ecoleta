import React from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';

import logo from '../../assets/logo.svg'
import './Home.css' 

const Home: React.FC = () => {
  return(
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="logo"/>
        </header>
    
        <main>
          <h1>Seu marketplace de coleta de resíduos</h1>
          <p>Ajudamos pessoas a encontrar pontos de coleta de forma eficiente</p>
          
          <Link to="/create-point" >
            <span>
              <FiLogIn />
            </span>
            <strong>Cadastrar ponto de coleta</strong>
          </Link>
       
        </main>
      </div>
    </div>
    );
  }
    
    export default Home;