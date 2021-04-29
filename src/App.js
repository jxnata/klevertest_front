import React, { useEffect, useState } from 'react'
import { Button, Form, FormGroup, Label, Input, Row, Col, CustomInput } from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify'
import { validate } from 'bitcoin-address-validation'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import api from './api'

function App() {

	const [confirmedBalance, setConfirmedBalance] = useState('')
	const [unconfirmedBalance, setUnconfirmedBalance] = useState('')
	const [btcAddress, setBtcAddress] = useState('')
	const [loading, setLoading] = useState(false)
	const [auto, setAuto] = useState(false)
	const [intervalId, setIntervalId] = useState(false)

	useEffect(() => {
		if (auto) {
			setLoading(true)
			setIntervalId(setInterval(getBalance, 10000))
		} else {
			setLoading(false)
			clearInterval(intervalId)
		}
	}, [auto])

	const getBalance = e => {
		if (e) {
			e.preventDefault()
		}
		setLoading(true)

		if (validate(btcAddress)) {
			api.get(`/balance/${btcAddress}`)
				.then(result => {

					setConfirmedBalance(result?.data?.confirmed)
					setUnconfirmedBalance(result?.data?.unconfirmed)
					setLoading(false)

					if (!auto) {
						toast('Success!', { type: 'success' })
					}
				})
				.catch(error => {
					toast(error.response?.data?.error, { type: 'error' })
				})
		} else {
			setLoading(false)
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
											<Input type='text' readOnly name='confirmedBalance' id='confirmedBalance' value={confirmedBalance} />
										</FormGroup>
									</Col>
									<Col>
										<FormGroup>
											<Label for='unconfirmedBalance'>Unconfirmed Balance</Label>
											<Input type='text' readOnly name='unconfirmedBalance' id='unconfirmedBalance' value={unconfirmedBalance} />
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
										onChange={e => setBtcAddress(e.target.value)}
										disabled={loading || auto}
									/>
								</FormGroup>
								{(validate(btcAddress) && confirmedBalance != '') && (
									<CustomInput
										type='switch'
										id='autoSwitch'
										label={auto ? 'Auto update balance is enabled...' : 'Auto update'}
										htmlFor='autoSwitch'
										checked={auto}
										onChange={e => setAuto(e.target.checked)}
									/>
								)}
								<br></br>
								<div className='d-flex align-items-center justify-content-center'>
									<Button size='lg' color='success' disabled={loading || auto}>Submit</Button>
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
