import { Tabs, Tab } from 'react-bootstrap'
import dBank from '../abis/dBank.json' // abi token import
import React, { Component } from 'react';
import Token from '../abis/Token.json' // abi token import
import dbank from '../dbank.png';
import Web3 from 'web3';
import './App.css';

//h0m3w0rk - add new tab to check accrued interest

class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {

    // check if metamask connected
    if(typeof window.ethereum !== 'undefined'){

      const web3 = new Web3(window.ethereum)
      const netId = await web3.eth.net.getId()
      const accounts = await web3.eth.getAccounts()

      // check if account is connected
      if(typeof accounts[0] !=='undefined'){
        const balance = await web3.eth.getBalance(accounts[0])
        this.setState({account: accounts[0], balance:balance, web3: web3})
      }else{
        window.alert('Please login with Metamask')
      }

      // load token and dBank smart contracts
      try{
        const token = new web3.eth.Contract(Token.abi,Token.networks[netId].address)
        const dbank = new web3.eth.Contract(dBank.abi,dBank.networks[netId].address)
        const dBankAddress = dBank.networks[netId].address
        console.log(dBankAddress)
        this.setState({token: token, dbank:dbank,dBankAddress:dBankAddress})
      } catch(e){ // throw error if contract code fails
        console.log('Error', e)
        window.alert('Contracts not deployed to current network.')
      }
  }else{
    window.alert("Metamask not found")
  }
  }

  async deposit(amount) {
    //check if this.state.dbank is ok
      //in try block call dBank deposit();
      alert(amount)
  }

  async withdraw(e) {
    //prevent button from default click
    //check if this.state.dbank is ok
    //in try block call dBank withdraw();
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      dbank: null,
      balance: 0,
      dBankAddress: null
    }
  }

  render() {
    return (
      <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
        <img src={dbank} className="App-logo" alt="logo" height="32"/>
          <b>dBank</b>
        </a>
        </nav>
        <div className="container-fluid mt-5 text-center">
        <br></br>
          <h1>Welcome to Dbank</h1>
          <h2>Your Adess: {this.state.account}</h2>
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey="deposit" title="Deposit">ayo
                  <div>
                    <br />
                    How much do you want to deposit?
                    <br />
                      minimum .01 Ether
                    <br />
                    (1 deposit allowed at a time)
                    <br />
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      let amount = this.depositAmount.value
                      amount = amount * 10**18 // convert to wei
                      this.deposit(amount)

                    }}>
                      <div className='form-group mr-sm-2'>
                      <br />
                        <input
                          id='depositAmount'
                          step='0.01'
                          type='number'
                          min='0'
                          className="form-control form-control-md"
                          placeholder='Eth Amount..'
                          required
                          ref={(input) => {this.depositAmount = input}}
                          />
                      </div>
                      <button type='submit' className='btn btn-primary'> Deposit </button>
                    </form>
                  </div>
                </Tab>
                <Tab eventKey="withdraw" title="Withdraw">
                  <div>
                    Do you want to withdrawal your principal + interest?
                  </div>
                </Tab>
              </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;