import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import FormInput from "../Forms/FormInput";
import Button from "../Forms/Button";
import { CountryDropdown } from "react-country-region-selector";
import { apiInstance } from "./../../Utils";
import {
  selectCartTotal,
  selectCartItemsCount,
} from "./../../redux/Cart/cart.selectors";
import { clearCart } from "./../../redux/Cart/cart.actions";
import { createStructuredSelector } from "reselect";
import { useSelector, useDispatch } from "react-redux";
import "./styles.scss";

const initialAddressState = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
};

const mapState = createStructuredSelector({
  total: selectCartTotal,
  itemCount: selectCartItemsCount,
});

const PaymentDetails = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { total, itemCount } = useSelector(mapState);
  const dispatch = useDispatch();
  const history = useHistory();

  const [billingAddress, setBillingAddress] = useState({
    ...initialAddressState,
  });
  const [shippingAddress, setShippingAddress] = useState({
    ...initialAddressState,
  });
  const [recipientName, setRecipientName] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");

  useEffect(() => {
    if (itemCount < 1) {
      history.push("/");
    }
  }, [itemCount]);

  const handleShipping = (evt) => {
    const { name, value } = evt.target;
    setShippingAddress({
      ...shippingAddress,
      [name]: value,
    });
  };

  const handleBilling = (evt) => {
    const { name, value } = evt.target;
    setBillingAddress({
      ...billingAddress,
      [name]: value,
    });
  };

  const handleFormSubmit = async (evt) => {
    evt.preventDefault();
    const cardElement = elements.getElement("card"); //go grab the CardElement
    if (
      !shippingAddress.line1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postal_code ||
      !shippingAddress.country ||
      !billingAddress.line1 ||
      !billingAddress.city ||
      !billingAddress.state ||
      !billingAddress.postal_code ||
      !billingAddress.country ||
      !recipientName ||
      !nameOnCard
    ) {
      return;
    }

    apiInstance
      .post("/payments/create", {
        amount: total * 100,
        shipping: {
          name: recipientName,
          address: {
            ...shippingAddress,
          },
        },
      })
      .then(({ data: clientSecret }) => {
        stripe
          .createPaymentMethod({
            type: "card",
            card: cardElement,
            billing_details: {
              name: nameOnCard,
              address: {
                ...billingAddress,
              },
            },
          })
          .then(({ paymentMethod }) => {
            stripe
              .confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.id,
              })
              .then(({ paymentIntent }) => {
                dispatch(clearCart());
              });
          });
      });
  };

  const configCardElement = {
    iconStyle: "solid",
    style: {
      base: {
        fontSize: "16px",
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="paymentDetails">
      <form onSubmit={handleFormSubmit}>
        <div className="group">
          <h2>Shipping Address</h2>
          <FormInput
            required
            placeholder="Recipient Name"
            name="recipientName"
            handleChange={(evt) => setRecipientName(evt.target.value)}
            type="text"
            value={recipientName}
          />
          <FormInput
            required
            placeholder="Line1"
            name="line1"
            handleChange={(evt) => handleShipping(evt)}
            type="text"
            value={shippingAddress.line1}
          />
          <FormInput
            placeholder="Line2"
            name="line2"
            handleChange={(evt) => handleShipping(evt)}
            type="text"
            value={shippingAddress.line2}
          />
          <FormInput
            required
            placeholder="City"
            name="city"
            handleChange={(evt) => handleShipping(evt)}
            type="text"
            value={shippingAddress.city}
          />
          <FormInput
            required
            placeholder="State"
            name="state"
            handleChange={(evt) => handleShipping(evt)}
            type="text"
            value={shippingAddress.state}
          />
          <FormInput
            required
            placeholder="PostalCode"
            name="postal_code"
            handleChange={(evt) => handleShipping(evt)}
            type="text"
            value={shippingAddress.postal_code}
          />
          <div className="formRow checkoutInput">
            <CountryDropdown
              required
              onChange={(val) =>
                handleShipping({
                  target: {
                    name: "country",
                    value: val,
                  },
                })
              }
              valueType="short"
              value={shippingAddress.country}
            />
          </div>
        </div>
        <div className="group">
          <h2>Billing Address</h2>
          <FormInput
            required
            placeholder="Name on Cart"
            type="text"
            name="nameOnCard"
            handleChange={(evt) => setNameOnCard(evt.target.value)}
            value={nameOnCard}
          />
          <FormInput
            required
            placeholder="Line1"
            type="text"
            name="line1"
            handleChange={(evt) => handleBilling(evt)}
            value={billingAddress.line1}
          />
          <FormInput
            placeholder="Line2"
            type="text"
            name="line2"
            handleChange={(evt) => handleBilling(evt)}
            value={billingAddress.line2}
          />
          <FormInput
            required
            placeholder="City"
            type="text"
            name="city"
            handleChange={(evt) => handleBilling(evt)}
            value={billingAddress.city}
          />
          <FormInput
            required
            placeholder="State"
            type="text"
            name="state"
            handleChange={(evt) => handleBilling(evt)}
            value={billingAddress.state}
          />
          <FormInput
            required
            placeholder="PostalCode"
            type="text"
            name="postal_code"
            handleChange={(evt) => handleBilling(evt)}
            value={billingAddress.postal_code}
          />
          <div className="formRow checkoutInput">
            <CountryDropdown
              required
              valueType="short"
              value={billingAddress.country}
              onChange={(val) =>
                handleBilling({
                  target: {
                    name: "country",
                    value: val,
                  },
                })
              }
            />
          </div>
        </div>
        <div className="group">
          <h2>Cart Details</h2>
          <CardElement options={configCardElement} />
          <Button type="submit">Pay Now</Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentDetails;
