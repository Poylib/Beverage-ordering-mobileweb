import styled from 'styled-components';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import combi from '../assets/combination.jpeg';
import order from '../assets/order.jpeg';

const StyledStore = styled.div`
  display: block;
  height: 25vh;
  background-color: #f5f4f2;
  text-align: center;
  align-items: center;
  margin-top: 30px;
  padding-top: 10px;

  div.search_wrap {
    display: block;
    width: 100%;
    height: 25vh;
  }

  h3 {
    font-size: 1.2em;
    padding-bottom: 20px;
  }

  p {
    color: #666666;
    font-size: 1em;
    margin-bottom: 10px;
  }

  input {
    width: 70%;
    height: 5vh;
    font-size: 0.8em;
    margin-bottom: 10px;
    padding: 10px;
    outline: none;
    border: none;
  }

  button {
    font-size: 1em;
    height: 5vh;
    width: 70%;
    background: #3b3230;
    color: white;
    border: none;
  }
`;
const StyledCombi = styled.div`
  img {
    width: 100%;
  }
`;

interface SearchProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const Search = ({ search, setSearch }: SearchProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const goToProduct = () => {
    navigate('./product');
  };
  const goToOrder = () => {
    navigate('./order');
  };

  const goToStore = () => {
    navigate('./store');
  };

  // 매장명 검색 버튼을 누르면 store에 검색이 되면서 검색화면이 나와야함.

  const inputHandler: React.FormEventHandler<HTMLInputElement> = e => {
    if (e.target instanceof HTMLInputElement) {
      setInputValue(e.target.value);
    }
  };

  const submitHandler: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();

    if (!inputValue) {
      alert('매장명을 입력해주세요');
    } else {
      setSearch(inputValue);
      navigate('/store');
    }
  };

  return (
    <div>
      <StyledStore>
        <div className='search_wrap'>
          <h3>매장검색</h3>
          <p className='speed'>공차 매장을 쉽고 빠르게 찾아보세요</p>
          <form onSubmit={submitHandler}>
            <input onChange={inputHandler} name='store' type='text' ref={inputRef} placeholder='매장명 또는 주소를 입력하세요' />
            <div>
              <button type='submit'>매장 검색하기</button>
            </div>
          </form>
        </div>
      </StyledStore>
      <StyledCombi>
        <img onClick={goToProduct} src={combi}></img>
        <img onClick={goToOrder} src={order}></img>
      </StyledCombi>
    </div>
  );
};
export default Search;
