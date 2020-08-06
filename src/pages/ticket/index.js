import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import './style.css';
import api from '../../service/api';


export default function Ticket() {

    const token = localStorage.getItem('token');
    const history = useHistory();
    const headerRequisicao = {
        headers: {
            'Session-Token': token
        }
    }


    const [chamadas, setChamadas] = useState([]);

    const [nomeChamada, setNomeChamada] = useState("");
    const [statusChamada, setStatusChamada] = useState("");
    const [descricaoChamada, setdescricaoChamada] = useState("");
    const [id, setId] = useState(-1);


    useEffect(() => {
        listarChamadas();
    }, [token])

    return (
        <div className="ticket">

            <a onClick={(e) => {
                e.preventDefault()
                localStorage.clear();
                history.push('/');
            }} href="">(logout)</a>
            <br></br>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Título</th>
                        <th scope="col">Status</th>
                        <th scope="col">Alterar</th>
                        <th scope="col">Remover</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        chamadas.map((chamada, index) => {
                            return (
                                <tr key={chamada.id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{chamada.name}</td>
                                    <td>{chamada.status}</td>
                                    <td>
                                        <button
                                            onClick={e => onAlterar(e, chamada)}> Alterar
                                    </button>
                                    </td>
                                    <td>
                                        <button
                                            onClick={e => onRemover(e, chamada.id, chamada.name)}> Remover
                                    </button>
                                    </td>
                                </tr>)
                        })
                    }
                </tbody>
            </table>

            <br />
            <form>
                <div className="form-group">
                    <label for="nomechamada">Nome da chamada</label>
                    <input type="text" className="form-control" id="nomechamada" placeholder="Nome da chamada"
                        value={nomeChamada}
                        onChange={e => setNomeChamada(e.target.value)}
                        required />

                </div>

                <div className="form-group">
                    <label for="statuschamada">Status</label>
                    <input type="number" className="form-control" id="statuschamada" placeholder="Status da chamada"
                        value={statusChamada}
                        onChange={e => setStatusChamada(e.target.value)}
                        required />
                </div>

                <div className="form-group">
                    <label for="descricaoChamada">Descrição da chamada</label>
                    <input type="text" className="form-control" id="descricaoChamada" placeholder="Data de resolução"
                        value={descricaoChamada}
                        onChange={e => setdescricaoChamada(e.target.value)}
                        required />
                </div>

                <button type="submit" className="btn btn-primary btn-ms btn-block" onClick={e => onSubmeter(e)}>{id === -1 ? "Criar" : "Alterar"}</button>
                <button type="submit" className="btn btn-warning btn-ms btn-block" onClick={e => onLimparCampos(e)}>Limpar campos</button>
            </form>

        </div>
    );

    //buscar chamadas na api, atualizar lista de chamadas na tela
    function listarChamadas() {
        api.get('/ticket', headerRequisicao).then((result) => {
            const chamadas = result.data;

            setChamadas(chamadas);

            onLimparCampos();
            console.log(chamadas)
        }).catch((err) => {
            localStorage.clear();
            alert("Erro de autenticação!");
            history.push('/');
        });
    }

    function onAlterar(e, chamada) {
        e.preventDefault();


        setNomeChamada(chamada.name);
        setStatusChamada(chamada.status);
        setdescricaoChamada(chamada.content.replace("&lt;p&gt;", "").replace("&lt;/p&gt;", ""));
        setId(chamada.id)
    }

    function onRemover(e, id, nomeChamada) {
        e.preventDefault();

        if (window.confirm(`Chamada: ${nomeChamada}\n\n Você realmente deseja remover esta chamada ?\n`))
            api.delete(`/ticket/${id}`, headerRequisicao)
                .then((result) => {
                    alert("Chamada removida com sucesso.");
                }).catch((err) => {
                    alert("Não foi possível remover chamada.");

                }).finally(() => {
                    listarChamadas();
                });
    }

    function onLimparCampos(e = null) {
        if (e) e.preventDefault();
        setNomeChamada("");
        setStatusChamada("");
        setdescricaoChamada("");
        setId(-1)

    }

    function onSubmeter(e) {
        e.preventDefault();

        const bodyRequisicao = {
            "input": {
                name: nomeChamada,
                status: statusChamada,
                content: descricaoChamada
            }
        }

        if (id > 0) { //alterar
            const caminho = `/Ticket/${id}`;

            api.put(
                `/Ticket/${id}`,
                bodyRequisicao,
                headerRequisicao
            ).then((result) => {
                alert("Chamada alterada com sucesso.");
            }).catch((err) => {
                alert("Não foi possível alterar chamada.");
                console.log(err.response)
            }).finally(() => listarChamadas())

        } else {  //criar
            const caminho = `/Ticket`;

            api.post(
                caminho,
                bodyRequisicao,
                headerRequisicao
            ).then((result) => {
                alert("Chamada alterada com sucesso.");
            }).catch((err) => {
                alert("Não foi possível alterar chamada.");
                console.log(err)
            }).finally(() => listarChamadas())
        }
    }
}