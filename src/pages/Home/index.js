import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MdAddShoppingCart } from 'react-icons/md';
import PropTypes from 'prop-types';
import Lottie from 'react-lottie';
import animationData from '../../assets/animations/1712-bms-rocket.json';
import { FormatPrice } from '../../util/format';
import api from '../../services/api';

import * as CartActions from '../../store/modules/cart/actions';

import { ProductList } from './styles';

class Home extends Component {
  state = {
    products: [],
    loading: true,
  };

  static propTypes = {
    addToCart: PropTypes.func.isRequired,
    amount: PropTypes.shape().isRequired,
  };

  async componentDidMount() {
    const response = await api.get('/products');

    const data = response.data.map(product => ({
      ...product,
      priceFormatted: FormatPrice(product.price),
    }));

    this.setState({ products: data, loading: false });
  }

  handleAddProduct = id => {
    // Dispara a ação
    const { addToCart } = this.props;

    addToCart(id);
  };

  render() {
    const { products, loading } = this.state;
    const { amount } = this.props;
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };
    return (
      <>
        {loading ? (
          <Lottie options={defaultOptions} height={400} width={400} />
        ) : (
          <ProductList>
            {products.map(product => (
              <li key={product.id}>
                <img src={product.image} alt={product.title} />
                <strong>{product.title}</strong>
                <span>{product.priceFormatted}</span>

                <button
                  type="button"
                  onClick={() => this.handleAddProduct(product.id)}
                >
                  <div>
                    <MdAddShoppingCart size={16} color="#fff" />
                    {amount[product.id] || 0}
                  </div>

                  <span>Adicionar ao carrinho</span>
                </button>
              </li>
            ))}
          </ProductList>
        )}
      </>
    );
  }
}
const mapStateToProps = state => ({
  amount: state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;
    return amount;
  }, {}),
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
