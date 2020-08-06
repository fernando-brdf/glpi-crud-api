import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

import './style.css';
import api from '../../service/api'


export default function Login() {

    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const history = useHistory();

    return (

        <div className="login">
            <form className="form-signin">
                <img className="mb-4" src="glpi.png" alt="glpi" width="200" height="100" />
                {/*                 <h1 className="h3 mb-3 font-weight-normal">Fazer login</h1>
 */}
                <label for="inputUser" className="sr-only">Usuário</label>
                <input type="text" id="inputUser" className="form-control" placeholder="Seu usuário" required autofocus
                    value={usuario}
                    onChange={e => setUsuario(e.target.value)} />

                <label for="inputPassword" className="sr-only">Senha</label>
                <input type="password" id="inputPassword" className="form-control" placeholder="Senha" required
                    value={senha}
                    onChange={e => setSenha(e.target.value)} />
                {/* <div className="checkbox mb-3">
                    <label className="pt-2">
                        <input type="checkbox" value="remember-me" /> Lembrar de mim
                </label>
                </div> */}
                <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={e => onLogar(e)}>
                    Logar
                </button>
                <p className="mt-5 mb-3 text-muted text-center">&copy; 2017-2018</p>
            </form>
        </div>
    );


    //fazer login na api, salvar token e redirecionar para página de ticket
    function onLogar(e) {
        e.preventDefault();


        const credenciais = btoa(usuario + ":" + senha);

        api.get("/initSession", {
            headers: {
                Authorization: 'Basic ' + credenciais
            }
        })
            .then((result) => {
                localStorage.setItem('token', result.data.session_token);
                history.push("/ticket")
            }).catch((err) => {
                alert("Erro de autenticação.\n Usuário ou senha incorreta!");
            });

    }
}