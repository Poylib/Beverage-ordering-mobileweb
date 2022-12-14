import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ErrorModal from '../../components/ErrorModal';
import Line from '../../components/Line';
import Spinner from '../../components/Spinner';
import useStore from '../../context/store';
import { CartPayReq, OrderData } from '../../interface';
import theme from '../../theme';
import OrderList from './OrderList';

const StyledBtn = styled.button`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  font-size: 5vw;
  height: calc(8vw + 20px);
  background-color: ${theme.red};
  border: none;
  padding: 10px;
  color: white;

  &:disabled {
    background-color: #aaaaaa;
  }
`;

const StyledOrder = styled.div`
  padding: 10px 0px calc(8vw + 20px) 0px;

  div.container {
    padding: 10px;
  }

  h4 {
    margin-top: 40px;
    font-size: 6vw;

    &:first-of-type {
      margin-top: 20px;
    }
  }

  p {
    margin-top: 10px;
    font-size: 5vw;
  }

  div.caution {
    p {
      font-size: 4vw;
    }
  }

  div.receipt {
    margin-top: 20px;
    background-color: ${theme.grey};
    padding: 10px;

    p {
      display: flex;
      justify-content: space-between;

      span {
        color: ${theme.red};
      }

      &:first-of-type {
        margin-top: 0;
      }
    }
  }
`;

interface CartOrderProps {
  order: OrderData | undefined;
  selectList: number[];
}

const CartOrder = ({ order, selectList }: CartOrderProps) => {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const { token } = useStore();

  useEffect(() => {
    if (!order) {
      navigate('/cart');
    } else {
      window.scrollTo({ top: 0 });
    }
  }, []);

  const cartPayHandler = async () => {
    setDisabled(true);

    try {
      await axios.patch<{ message: string }, AxiosResponse<{ message: string }>, CartPayReq>(
        'http://localhost:8000/beverages/cartOrder',
        selectList.map(id => ({ id })),
        {
          headers: {
            Authorization: token,
          },
        }
      );

      navigate('/history');
    } catch (error) {
      console.log(error);
      setErrorModal(true);
    }
  };

  if (!order) {
    return <Spinner fixed={true} />;
  }

  return (
    <>
      {errorModal && <ErrorModal errorMessage='????????? ?????????????????????. ???????????? ??????????????????.' errorModal={errorModal} setErrorModal={setErrorModal} />}
      <StyledOrder>
        <div className='container'>
          <h4>?????? ??????</h4>
          <Line />
          <p>{order.userName}???</p>
          <p>{order.phone_number}</p>
          <h4>?????? ??????</h4>
          <Line />
          <p>{order.shopName}</p>
          <h4>?????? ??????</h4>
          <Line />
          <p>{order.take_out ? '???????????????' : '??????'}</p>
          <h4>?????? ?????????</h4>
          <Line />
          <p>{Number(order.point).toLocaleString()}???</p>

          <div className='caution'>
            <p>????????? ????????? ????????????.</p>
          </div>

          <h4>?????? ????????????</h4>
          <Line />
          <ul>
            {order.beverageData
              .filter(beverageData => selectList.includes(beverageData.orderId))
              .map(beverageData => (
                <OrderList beverageData={beverageData} key={beverageData.orderId} />
              ))}
          </ul>
        </div>
        <div className='receipt'>
          <p>
            ??? ?????? ??????
            <span>{order.beverageData.reduce((prev, acc) => prev + acc.amount * (Number(acc.price) + acc.toppingData.filter(top => top.amount).reduce((prev, acc) => prev + acc.amount * 500, 0)), 0).toLocaleString()}???</span>
          </p>
          <p>
            ??? ?????? ?????? <span>0???</span>
          </p>
          <Line />
          <p>
            ??? ?????? ??????
            <span>
              {order.beverageData
                .filter(data => selectList.includes(data.orderId))
                .reduce((prev, acc) => prev + acc.amount * (Number(acc.price) + acc.toppingData.filter(top => top.amount).reduce((prev, acc) => prev + acc.amount * 500, 0)), 0)
                .toLocaleString()}
              ???
            </span>
          </p>
        </div>
        <StyledBtn disabled={disabled} onClick={cartPayHandler}>
          {disabled ? <Spinner /> : '????????????'}
        </StyledBtn>
      </StyledOrder>
    </>
  );
};

export default CartOrder;
