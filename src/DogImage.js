import React, { Component } from 'react';

const URL = 'https://dog.ceo/api/breeds/image/random';

class DogImage extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      loading: false,
      imageLink: null,
      name: '',
      links: [],
      currentDog: '',
    }
  }

  onClick = () => {
    this.fetchRequest();
  }

  onClickSave = () => {
    this.saveLocalStorage();
    this.setState({ name: '' });
    this.localStorageLoad();
    this.searchName();
  }

  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  }

  fetchRequest = async () => {
    this.setState(
      { loading: true }, //Primeiro parametro da setState();
    async () => {
      try {
        const requestReturn = await fetch(URL);
        const requestImageLink = await requestReturn.json();
        const { message } = requestImageLink;
        this.setState({
          loading: false,
          error: null,
          imageLink: message,
          name: '',
          currentDog: '',
        });
      } catch(e) {
        this.setState({ error: `Erro! --> ${e} -- Recarregue a página ou tente mais tarde` });
      }
    });
  };

  searchName = () => {
    const { links, imageLink, name } = this.state;
    const hasDog = links.find((dog) => dog.link === imageLink);
    this.setState({ currentDog: hasDog ? hasDog.name : name }); 
  }

  saveLocalStorage = () => {
    const items = [];
    const { name, imageLink } = this.state;
    const item = { name: name, link: imageLink };
    if (JSON.parse(localStorage.getItem('items')) === null) {
      items.push(item);
      localStorage.setItem('items', JSON.stringify(items));
    } else {
      const localItens = JSON.parse(localStorage.getItem('items'));
      let localItensUpdate = localItens.some(iten => iten.link === imageLink);
      if (localItensUpdate) {
        localItensUpdate = localItens.map((iten) => {
          if (iten.link !== imageLink) {
            console.log('diferente')
            return iten;
          } else {
            console.log('igual')
            return { name: name, link: iten.link};
          }
        });
        localStorage.setItem('items', JSON.stringify(localItensUpdate));
      } else {
        console.log('Não tem')
        localItens.push(item);
        localStorage.setItem('items', JSON.stringify(localItens));
      }
    }
  }

  localStorageLoad = () => {
    if (typeof localStorage !== 'undefined') {
      if(localStorage.length > 0) {
        const localItens = JSON.parse(localStorage.getItem('items'));
        this.setState({ links: [...localItens]});
      } else {
        alert('No local!!');
      }
    } else {
      alert('LocalStorage is not available!!');
    }
  }

  componentDidMount() {
    this.fetchRequest();
    this.localStorageLoad();
    this.searchName();
  }

  render() {
    const { error, loading, imageLink, name, currentDog } = this.state;
    if (error) return <div>{error}</div>;
    else if (loading) return <div>Loading...</div>; 
    else return (
      <div>
        <div>
          { currentDog ?? <span>{currentDog}</span> }
        </div>
        <div>
          <img src={imageLink} style={ { maxWidth: '400px', maxHeight: '400px' } } alt="imagem cachorro"/>
        </div>
        <div>
          <input type="text" name="name" value={ name } onChange={ this.handleChange }/>
          <button type="button" onClick={ this.onClickSave }>Salvar</button>
        </div>
        <div>
          <button type="button" onClick={ this.onClick }>Outra imagem</button>
        </div>
      </div>
    );
  }
}

export default DogImage;
