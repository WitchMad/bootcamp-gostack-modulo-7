import React, { useState } from 'react';
import {
  MdRemoveCircleOutline,
  MdAddCircleOutline,
  MdDelete,
  MdRemoveShoppingCart,
} from 'react-icons/md';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Lottie from 'react-lottie';
import { bindActionCreators } from 'redux';
import animationData from '../../assets/animations/lf30_editor_Led7Ze.json';
import * as CartActions from '../../store/modules/cart/actions';
import { Container, ProductTable, Total } from './styles';
import { FormatPrice } from '../../util/format';

function Cart({ cart, total, removeFromCart, updateAmountRequest, cleanCart }) {
  Cart.propTypes = {
    cart: PropTypes.shape({
      map: PropTypes.func.isRequired,
      length: PropTypes.number.isRequired,
    }).isRequired,
    total: PropTypes.string.isRequired,
    removeFromCart: PropTypes.func.isRequired,
    updateAmountRequest: PropTypes.func.isRequired,
    cleanCart: PropTypes.func.isRequired,
  };

  const [finalized, setFinalized] = useState(false);

  function increment(product) {
    updateAmountRequest(product.id, product.amount + 1);
  }
  function decrement(product) {
    updateAmountRequest(product.id, product.amount - 1);
  }

  function finalizedOrder() {
    setFinalized(true);
    cleanCart();
  }

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Container>
      {finalized ? (
        <>
          <h1>Compra realizada com sucesso!</h1>
          <Lottie options={defaultOptions} height={300} width={300} />
        </>
      ) : (
        <>
          {cart.length !== 0 ? (
            <ProductTable>
              <thead>
                <tr>
                  <th />
                  <th>PRODUTO</th>
                  <th>QTD</th>
                  <th>SUBTOTAL</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {cart.map(product => (
                  <tr key={product.id}>
                    <td>
                      <img src={product.image} alt={product.title} />
                    </td>
                    <td>
                      <strong>{product.title}</strong>
                      <span>{product.priceFormatted}</span>
                    </td>
                    <td>
                      <div>
                        <button
                          type="button"
                          onClick={() => decrement(product)}
                        >
                          <MdRemoveCircleOutline size={20} color="#7159c1" />
                        </button>
                        <input type="number" readOnly value={product.amount} />
                        <button
                          type="button"
                          onClick={() => increment(product)}
                        >
                          <MdAddCircleOutline size={20} color="#7159c1" />
                        </button>
                      </div>
                    </td>
                    <td>
                      <strong>{product.subtotal}</strong>
                    </td>
                    <td>
                      <button type="button">
                        <MdDelete
                          size={20}
                          color="#7159c1"
                          onClick={() => removeFromCart(product.id)}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </ProductTable>
          ) : (
            <>
              <MdRemoveShoppingCart size={100} color="#666" />
              <h2>Seu carrinho está vazio...</h2>
            </>
          )}

          <footer>
            <button type="button" onClick={() => finalizedOrder()}>
              Finalizar Pedido
            </button>

            <Total>
              <span>TOTAL</span>
              <strong>{total}</strong>
            </Total>
          </footer>
        </>
      )}
    </Container>
  );
}

const mapStateToProps = state => ({
  cart: state.cart.map(product => ({
    ...product,
    subtotal: FormatPrice(product.price * product.amount),
  })),
  total: FormatPrice(
    state.cart.reduce((total, product) => {
      return total + product.price * product.amount;
    }, 0)
  ),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);
