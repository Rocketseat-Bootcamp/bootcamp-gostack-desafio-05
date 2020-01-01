import React, { Component } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { FaGithubAlt, FaPlus, FaSpinner } from "react-icons/fa";
import { Form, SubmitButton, List } from "./style";
import Container from "../../components/Container";

export default class Main extends Component {
  state = {
    newRep: "",
    repositories: [],
    loading: false,
    errorResponse: false
  };

  componentDidMount() {
    const repositories = localStorage.getItem("repositories");

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem("repositories", JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRep: e.target.value });
  };

  handleSumbit = async e => {
    e.preventDefault();

    this.setState({ loading: true, errorResponse: false });

    const { newRep, repositories } = this.state;
    try {
      if (newRep === "") throw "Você precisa indicar um repositório";

      const hasRepo = repositories.find(r => r.name === newRep);

      if (hasRepo) throw "Repositório duplicado";

      const response = await api.get(`repos/${newRep}`);
      const data = {
        name: response.data.full_name
      };

      this.setState({
        repositories: [...repositories, data],
        newRep: "",
        loading: false,
        errorResponse: false
      });
    } catch (error) {
      this.setState({ newRep: "", loading: false, errorResponse: true });
    }
  };

  render() {
    const { newRep, loading, repositories, errorResponse } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositorios
        </h1>

        <Form onSubmit={this.handleSumbit} errorResponse={errorResponse}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRep}
            onChange={this.handleInputChange}
          />
          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(rep => (
            <li key={rep.name}>
              <span>{rep.name}</span>
              <Link to={`/repository/${encodeURIComponent(rep.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
