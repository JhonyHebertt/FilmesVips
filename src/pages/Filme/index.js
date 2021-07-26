
import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import './filme.css';
import api from '../../services/api';
import '../Erro';

import { toast } from 'react-toastify';

export default function Filme() {
  const { id } = useParams(); //é usado quando a variavel será um parametro dentro de uma rota
  const history = useHistory();//permite acessar outras páginas da aplicação. Um "redimencionamento".

  const [filme, setFilme] = useState([]);
  const [loading, setLoading] = useState(true); // Como a função loadFilme é async e pode demorar para ter um retorno, a função loading serve para mostrar algo enquanto se espera pelos dados da requisição da api

  useEffect(() => {

    loadFilme();

    async function loadFilme() {
      const listFilme = await api.get(`r-api/?api=filmes/${id}`);

      //Tentou acessar com um ID que nao existe, redireciona para pagina de erro!
      if (listFilme.data.length === 0) {
        history.replace('/Erro');
        return;
      }

      setFilme(listFilme.data);
      setLoading(false);
    }

    return () => {
      console.log('COMPONENTE DESMONTADO')
    }

  }, [history, id]);

  function salvaFilme() {

    const minhaLista = localStorage.getItem('filmes');

    let filmesSalvos = JSON.parse(minhaLista) || [];

    //Se tiver algum filme salvo com esse mesmo id precisa ignorar...
    const hasFilme = filmesSalvos.some((filmeSalvo) => filmeSalvo.id === filme.id)

    if (hasFilme) {
      toast.info('Você já possui esse filme salvo.');
      return;//Para execuçao do código aqui...      
    }

    filmesSalvos.push(filme);// push add na array na ultima posição
    localStorage.setItem('filmes', JSON.stringify(filmesSalvos));

    //componente de alerta
    toast.success('Filme salvo com sucesso!');
  }

  if (loading) {
    return (
      <div className="filme-info">
        <h1>Carregando seu filme...</h1>
      </div>
    )
  }

  //target="blank" é para abri a pagina em outra aba.
  return (
    <div className="filme-info">
      <h1> {filme.nome} </h1>
      <img src={filme.foto} alt={filme.nome} />

      <h3>Sinopse</h3>
      {filme.sinopse}

      <div className="botoes">
        <button onClick={salvaFilme} >Salvar</button>
        <button>
          <a target="blank" href={`https://youtube.com/results?search_query=${filme.nome} Trailer`}>
            Trailer
          </a>
        </button>
      </div>
    </div>
  )
}