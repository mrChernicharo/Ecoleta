import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import api from '../../Services/api';
import { LeafletMouseEvent } from 'leaflet'

import logo from '../../assets/logo.svg';
import './CreatePoint.css';

interface Item{
  id: number;
  image_url: string;
  title: string;
}
interface IBGEUFResponse {
  sigla: string;
}
interface IBGECityResponse {
  nome: string;
}

const CreatePoint = () =>{
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const[selectedUf, setSelectedUf] = useState('0');
  const[selectedCity, setSelectedCity] = useState('0');
  const[selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
  const[initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  })
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const history = useHistory();

  useEffect(() => {
    api.get('items').then(response => {
      // console.log(response);
      setItems(response.data);
    });
  }, []);


  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {

      const ufInitials = response.data.map(uf => uf.sigla);
      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    if (!selectedUf) {
      return;
    }
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
    .then(response => {

      const cityNames = response.data.map(city => city.nome);

      // console.log(cityNames)
      setCities(cityNames);

    })
  }, [selectedUf]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

    setInitialPosition([ latitude, longitude ]);

    })
  }, [])

  function handleSelectedUF(e: ChangeEvent<HTMLSelectElement>) {
    const uf = e.target.value;
    setSelectedUf(uf);
    // console.log(selectedUf);
  }

  function handleSelectedCity(e: ChangeEvent<HTMLSelectElement>){
    const city = e.target.value;
    setSelectedCity(city);
  }

  function handleMapClick(e: LeafletMouseEvent){
    setSelectedPosition([ e.latlng.lat, e.latlng.lng ]);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>){
    const { name, value } = e.target

    setFormData({ ...formData, [name]:value });
  }

  function handleSelectItem(id:number){
    const alreadySelected = selectedItems.findIndex(item => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);

      setSelectedItems(filteredItems);

    } else {
      setSelectedItems([...selectedItems, id])
    }

  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = {
      name,
      email,
      whatsapp,
      uf,
      city,
      latitude,
      longitude,
      items
    }

    await api.post('points', data);

    alert('ponto criado!')

    history.push('/');

  }

  return(

      <div id="page-create-point">
        <header>
          <img src={logo} alt="logo"/>

         <Link to="/">
           <FiArrowLeft/>
          Voltar para Home
         </Link>
        </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br />Ponto de coleta </h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
              <label htmlFor="name">Nome da entidade</label>
              <input type="text" name="name" id="name" onChange={handleInputChange}/>
          </div>


          <div className="field-group">   
            <div className="field">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" onChange={handleInputChange}/>
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange}/>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

        <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={selectedPosition}/>
        </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select name="uf" value={selectedUf} id="uf" onChange={handleSelectedUF}>
                <option value="0">Selecione o Estado</option>
                {ufs.map(uf => {
                  return (
                    <option key={uf} value={uf}>{uf}</option>
                  )
                })}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" value={selectedCity} id="city" onChange={handleSelectedCity}>
                <option value="0">Selecione a cidade</option>
                {cities.map(city => {
                  return(
                    <option key={city} value={city}>{city}</option>
                  );
                })}

              </select>
            </div>

          </div>
        </fieldset>
        

        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>
          <ul className="items-grid">

            {items.map(item => {
              return(
                <li 
                key={item.id} 
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? ' selected': '' }
                >
                  <img  src={item.image_url} alt={item.title}/>
                  <span>{item.title}</span>
                </li>
              )  
            })}

          </ul>
        </fieldset>
        <button type="submit">
          Cadastrar ponto de coleta
        </button>
        


      </form>
      </div>
 
  );  
}
export default CreatePoint;