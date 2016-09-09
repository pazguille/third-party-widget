/**
 * Module dependencies
 */
import Preact from 'preact';

/**
 * Component
 */
import TokenFrom from './components/TokenForm';

/**
 * PaymentFrom
 */
function PaymentForm(options) {
  Preact.render(
    <TokenFrom
      handleSubmit={options.handleSubmit}
      color={options.color}
    />,
    options.container
  );
}

/**
 * Expose PaymentFrom
 */
export default PaymentForm;
