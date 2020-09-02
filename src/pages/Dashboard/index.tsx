import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom';

import api from '../../services/api';

import logo from '../../assets/logo.svg';
import { Title, Form, Repositories, Error } from './style';

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string
    }
}


 
const Dashboard: React.FC = () => {

    const [newRepositorie, setNewRepositorie] = useState('');

    const [inputError, setInputError] = useState('');

    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storageRepositories = localStorage.getItem('@GithubExplorer:repositories');

        if(storageRepositories)
            return JSON.parse(storageRepositories);
        else
            return [];
    });

    useEffect(() => {
        localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories))
    }, [repositories]);

    async function handleAddRepository(e: FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();

        if(newRepositorie === ''){
            setInputError('Preencha um autor/repositório válido.');
            return;
        }


        try {
            const response = await api.get<Repository>(`repos/${newRepositorie}`);
            const repository = response.data;
            console.log(response.data);
            
            setRepositories([...repositories, repository]);
            setNewRepositorie('');
            setInputError('');
        } catch (err) {
            setInputError('Erro ao procurar o repositório informado');
            setNewRepositorie('');

        }
    }

    return (
        <>
            <img src={logo} alt="github explorer" />
            <Title>Explore repositórios no Github</Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository} >
                <input 
                    value={newRepositorie}
                    onChange={(e) => setNewRepositorie(e.target.value)}
                    placeholder="Digite o nome do repositório" 
                />
                <button type="submit" >Pesquisar</button>
            </Form>

            {inputError && <Error>{ inputError }</Error>}

            <Repositories>
                {repositories.map(repository => (
                    <Link key={repository.full_name} to={`repository/${repository.full_name}`}>
                        <img src={repository.owner.avatar_url} 
                            alt={repository.owner.login} />
                        <div>
                            <strong> {repository.full_name} </strong>
                            <p> {repository.description} </p>
                        </div>

                        <FiChevronRight size={20} />
                    </Link>
                ))}
            </Repositories>
        </>
    );
}


export default Dashboard;