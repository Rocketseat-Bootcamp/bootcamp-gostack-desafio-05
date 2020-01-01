import styled from 'styled-components';

const Container = styled.div`
  max-width: 730px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 20px rgb(0, 0, 0, 0.1);
  padding: 30px;
  margin: 80px auto;

  h1 {
    font-size: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;

    svg {
      margin-right: 10px;
    }
  }
`;

export default Container;
