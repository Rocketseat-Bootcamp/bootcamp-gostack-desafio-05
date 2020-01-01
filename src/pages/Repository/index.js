import React, { Component } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";

import PropTypes from "prop-types";
import api from "../../services/api";

import { Loading, Owner, IssueList, PageIssueList } from "./styles";
import Container from "../../components/Container";

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string
      })
    }).isRequired
  };

  state = {
    page: 1,
    repository: {},
    issues: [],
    loading: true,
    valueStatus: { label: "Todos", value: "all" },
    options: [
      {
        label: "Todos",
        value: "all"
      },
      {
        label: "Abertos",
        value: "open"
      },
      {
        label: "Fechado",
        value: "closed"
      }
    ]
  };

  async componentDidMount() {
    const { match } = this.props;
    const {
      valueStatus: { value }
    } = this.state;
    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: value,
          per_page: 5
        }
      })
    ]);

    this.setState({
      loading: false,
      issues: issues.data,
      repository: repository.data
    });
  }

  componentDidUpdate = async (_, prevState) => {
    if (
      this.state.valueStatus != prevState.valueStatus ||
      this.state.page != prevState.page
    ) {
      const issues = await this.getIssues();
      this.setState({ issues: issues.data });
    }
  };

  handlePage = async page => {
    const countPage =
      page == "next" ? this.state.page + 1 : this.state.page - 1;
    this.setState({
      page: countPage
    });
  };
  handleStatus = async status => this.setState({ valueStatus: status });

  getIssues = async () => {
    const { match } = this.props;
    const {
      valueStatus: { value },
      page
    } = this.state;
    const repoName = decodeURIComponent(match.params.repository);

    return await api.get(`/repos/${repoName}/issues`, {
      params: {
        state: value,
        page: page,
        per_page: 5
      }
    });
  };

  render() {
    const {
      repository,
      issues,
      loading,
      options,
      valueStatus,
      page
    } = this.state;

    {
      if (loading) {
        return <Loading>Carregando</Loading>;
      }
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar ao link inicial</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <Select
          options={options}
          value={valueStatus}
          onChange={value => this.handleStatus(value)}
          defaultValue={{ label: "Todos", value: "all" }}
        />

        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}> {issue.title} </a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>

        <PageIssueList>
          <button
            type="button"
            disabled={page < 2}
            onClick={() => this.handlePage("back")}
          >
            Anterior
          </button>
          <span>Página {page}</span>
          <button type="button" onClick={() => this.handlePage("next")}>
            Próximo
          </button>
        </PageIssueList>
      </Container>
    );
  }
}
