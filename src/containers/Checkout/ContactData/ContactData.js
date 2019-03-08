import React, { Component } from 'react';
import axios from 'axios';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import './ContactData.css';

class ContactData extends Component {
	state = {
		orderForm: {
			name: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Your Name'
				},
				value: '',
				validation: {
					required: true
				}, 
				valid: false,
				touched: false
			},
			street: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Your Street'
				},
				value: '',
				validation: {
					required: true
				}, 
				valid: false,
				touched: false
			},
			zipCode: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'ZIP Code'
				},
				value: '',
				validation: {
					required: true,
				}, 
				valid: false,
				touched: false
			},
			country: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Your Country'
				},
				value: '',
				validation: {
					required: true
				}, 
				valid: false,
				touched: false
			},
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'email',
					placeholder: 'Your E-Mail'
				},
				value: '',
				validation: {
					required: true
				}, 
				valid: false,
				touched: false
			},
			deliveryMethod: {
				elementType: 'select',
				elementConfig: {
					options: [
						{value: 'fastest', displayValue: 'Fastest'},
						{value: 'cheapest', displayValue: 'Cheapest'}
					]
				},
				value: '',
				validation: {},
				valid: true
			}
		},
		loading: false,
		formIsValid: false
	}

	orderHandler = (event) => {
		event.preventDefault();
		this.setState({ loading: true });
		const formData = {};
		for (let formElementIdentifier in this.state.orderFom) {
			formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value; 
		}
		const order = {
			ingredients: this.props.ingredients,
			price: this.props.price,
			orderData: formData }

		axios.post('https://react-my-burger-dpa.firebaseio.com/order.json', order)
			.then(response => {
				this.setState({ loading: false })
				this.props.history.push('/');})
			.catch(error => this.setState({ loading: false }));
	}
	
	checkValidity(value, rules){
		let isValid = true;
		if(rules.required) {
			isValid = value.trim() !== '' && isValid;
		}
		if(rules.minLength) { 
			isValid = value.lenght <= rules.minLength && isValid;
		}
		if(rules.maxLength) { 
			isValid = value.lenght >= rules.maxLength && isValid;
		}
		return isValid;
	}

	inputChangedHandler = (event, inputIdentifier) => {
		const updatedOrderForm = { ...this.state.orderForm };
		const updatedFormElement = { ...updatedOrderForm[inputIdentifier] };
		updatedFormElement.value = event.target.value;
		updatedOrderForm[inputIdentifier] = updatedFormElement;
		updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
		updatedFormElement.touched = true;

		let formIsValid = true;
		for (let inputIdentifier in updatedFormElement) {
			formIsValid = updatedFormElement[inputIdentifier].valid && formIsValid;
		}

		this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
	}

	render() {
		const formElementsArray = [];
		for (let key in this.state.orderForm) {
			formElementsArray.push({
				id: key,
				config: this.state.orderForm[key]
			});
		}

		let form = (
			<form onSubmit={this.orderHandler}>
				{formElementsArray.map(formElement => (
					<Input
						key={formElement.id}
						elementType={formElement.config.elementType} 
						elementConfig={formElement.config.elementConfig}
						value={formElement.config.value}
						invalid={!formElement.config.valid}
						shouldValidate={formElement.config.validation}
						touched={formElement.config.touched}
						changed={(event) => this.inputChangedHandler(event, formElement.id)} />
				))}
				<Button btnType='Success' disabled={!this.state.formIsValid}>ORDER</Button>
			</form>
		)
		if(this.state.loading) {
			form = <Spinner />
		}
		return (
			<div className='ContactData'>
				<h4>Enter your Contact Data</h4>
				{form}
			</div>
		);
	}
}

export default ContactData;
