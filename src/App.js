import React, { useState } from 'react'
import { Button, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify'
import { validate } from 'bitcoin-address-validation'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import api from './api'

function App() {

	const [confirmedBalance, setConfirmedBalance] = useState(0)
	const [unconfirmedBalance, setUnconfirmedBalance] = useState(0)
	const [btcAddress, setBtcAddress] = useState('')

	const getBalance = e => {
		e.preventDefault()

		if (validate(btcAddress)) {
			api.get(`/balance/${btcAddress}`)
				.then(result => {
					const confirmedArray = result?.data?.filter(i => i.confirmations >= 2).map(i => parseInt(i.value))
					const unconfirmedArray = result?.data?.filter(i => i.confirmations < 2).map(i => parseInt(i.value))

					setConfirmedBalance(confirmedArray.reduce((a, b) => a + b, 0))
					setUnconfirmedBalance(unconfirmedArray.reduce((a, b) => a + b, 0))

					toast('Success', { type: 'success' })
				})
				.catch(error => {
					toast(error.response?.data?.error, { type: 'error' })
				})
		} else {
			toast('The BTC address is invalid!', { type: 'error' })
		}
	}

	return (
		<>
			<div id='page'>
				<aside>
					<Row>
						<Col className='d-flex align-items-center justify-content-center'>
							<Form className='create-form' onSubmit={getBalance}>
								<Row>
									<Col>
										<FormGroup>
											<Label for='confirmedBalance'>Confirmed Balance</Label>
											<Input type='text' readOnly name='confirmedBalance' id='confirmedBalance' value={confirmedBalance.toFixed(2)} />
										</FormGroup>
									</Col>
									<Col>
										<FormGroup>
											<Label for='unconfirmedBalance'>Unconfirmed Balance</Label>
											<Input type='text' readOnly name='unconfirmedBalance' id='unconfirmedBalance' value={unconfirmedBalance.toFixed(2)} />
										</FormGroup>
									</Col>
								</Row>
								<br></br>
								<FormGroup>
									<Label for='btcAddress'>Bitcoin address</Label>
									<Input
										type='text'
										name='btcAddress'
										id='btcAddress'
										placeholder='Type your bitcoin address'
										value={btcAddress}
										onChange={text => setBtcAddress(text.target.value)}
									/>
								</FormGroup>
								<br></br>
								<div className='d-flex align-items-center justify-content-center'>
									<Button size='lg' color='success'>Submit</Button>
								</div>
							</Form>
						</Col>
					</Row>
				</aside>
			</div>
			<ToastContainer />
		</>
	)
}

export default App
