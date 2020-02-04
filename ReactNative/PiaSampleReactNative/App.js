/**
 * MIT License
 * <p>
 * Copyright (c) 2019 Nets Denmark A/S
 * <p>
 * Permission is hereby granted, free of charge, to any person obtaining a copy  of this software
 * and associated documentation files (the "Software"), to deal  in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is  furnished to do so,
 * subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * <p>
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
 * AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, ToastAndroid} from 'react-native';
import { NativeModules } from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const netsProduction = {

/*#external_code_section_start
    static let backendUrlProd: String = "YOUR PRODUCTION BACKEND BASE URL HERE"
    static let backendUrlTest: String = "YOUR TEST BACKEND BASE URL HERE"
    static let merchantIdProd: String = "YOUR PRODUCTION NETAXEPT MERCHANT ID HERE"
    static let merchantIdTest: String = "YOUR TEST NETAXEPT MERCHANT ID HERE"
    static let tokenIdTest: String = "YOUR TEST TOKED ID"
    static let schemeIdTest: String = "YOUR TEST CARD PROVIDER NAME"
    static let expiryDateTest: String = "YOUR TEST CARD EXPIRY DATE"
#external_code_section_end*/

//#internal_code_section_start
    backendUrlProd: "https://api-gateway-pp.nets.eu/pia/merchantdemo/",
    merchantIdProd: "493809",
//#internal_code_section_end
};


const netsTest = {
/*#external_code_section_start
    static let backendUrlProd: String = "YOUR PRODUCTION BACKEND BASE URL HERE"
    static let backendUrlTest: String = "YOUR TEST BACKEND BASE URL HERE"
    static let merchantIdProd: String = "YOUR PRODUCTION NETAXEPT MERCHANT ID HERE"
    static let merchantIdTest: String = "YOUR TEST NETAXEPT MERCHANT ID HERE"
    static let tokenIdTest: String = "YOUR TEST TOKED ID"
    static let schemeIdTest: String = "YOUR TEST CARD PROVIDER NAME"
    static let expiryDateTest: String = "YOUR TEST CARD EXPIRY DATE"
#external_code_section_end*/
  //#internal_code_section_start
  backendUrlTest: "https://api-gateway-pp.nets.eu/pia/test/merchantdemo/",
  merchantIdTest: "12002835",
  tokenIdTest: "492500******0004",
  schemeIdTest: "Visa",
  expiryDateTest: "12/22"
  //#internal_code_section_end
};

type Props = {};
export default class App extends Component<Props> {
  render() {

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Pia Sample app React Native!</Text>
        <Text style={styles.instructions}>Check our basic implementation here!</Text>
        <View style={styles.button}>
          <Button style={styles.button} onPress={this.pay} title="Buy" />
        </View>
        <View style={styles.button}>
          <Button style={styles.button} onPress={this.saveCard} title="Save Card" />
        </View>
        <View style={styles.button}>
          <Button style={styles.button} onPress={this.paypal} title="Paypal" />
        </View>
        <View style={styles.button}>
          <Button style={styles.button} onPress={this.vipps} title="Vipps" />
        </View>
        <View style={styles.button}>
          <Button style={styles.button} onPress={this.swish} title="Swish" />
        </View>
        <View style={styles.button}>
          <Button style={styles.button} onPress={this.skipConfirm} title="Pay 10 EUR - Saved Card(Skip Confirmation)" />
        </View>
        <View style={styles.button}>
          <Button style={styles.button} onPress={this.unskipConfirm} title="Pay 10 EUR - Saved Card" />
        </View>
      </View>
    );
  }



  pay = () => {
    //for pay with new card, set only the MechantInfo and Order info objects
    NativeModules.PiaSDK.buildMerchantInfo(netsTest.merchantIdTest, true, true);
    NativeModules.PiaSDK.buildOrderInfo(1,"EUR");

    //set the payment result promise
    NativeModules.PiaSDK.handleSDKResult().then(()=>{
         ToastAndroid.show('SUCCESS', ToastAndroid.SHORT);
    }).catch((error) =>{
         ToastAndroid.show('CANCEL OR ERROR', ToastAndroid.SHORT);
    });
   
    NativeModules.PiaSDK.start((saveCardBool) => {
        fetch(netsTest.backendUrlTest + "v2/payment/"+ netsTest.merchantIdTest +"/register", {
            method: 'POST',
            headers: {
              'Accept': 'application/json;charset=utf-8;version=2.0',
              'Content-Type': 'application/json;charset=utf-8;version=2.0'
            },
            body: '{"storeCard": true,"orderNumber": "PiaSDK-Android","customerId": "000003","amount": {"currencyCode": "EUR", "totalAmount": "100","vatAmount": 0}}'
          }).then((response) => response.json())
              .then((responseJson) => {
                console.log('onResponse'+responseJson.transactionId)
                  NativeModules.PiaSDK.buildTransactionInfo(responseJson.transactionId ,responseJson.redirectOK);
              })
              .catch((error) => {
                console.error(error);
                 NativeModules.PiaSDK.buildTransactionInfo(null ,null);
              });
    });
  }

  saveCard = () => {
    //for save card only MerchantInfo object is required
    NativeModules.PiaSDK.buildMerchantInfo(netsTest.merchantIdTest, true, true);

    //set the payment result promise
    NativeModules.PiaSDK.handleSDKResult().then(()=>{
         ToastAndroid.show('SUCCESS', ToastAndroid.SHORT);
    }).catch((error) =>{
         ToastAndroid.show('CANCEL OR ERROR', ToastAndroid.SHORT);
    });

    NativeModules.PiaSDK.start((saveCardBool) => {
        fetch(netsTest.backendUrlTest + "v2/payment/"+ netsTest.merchantIdTest +"/register", {
            method: 'POST',
            headers: {
              'Accept': 'application/json;charset=utf-8;version=2.0',
              'Content-Type': 'application/json;charset=utf-8;version=2.0'
            },
            body: '{"storeCard": true,"orderNumber": "PiaSDK-Android","customerId": "000003","amount": {"currencyCode": "EUR", "totalAmount": "1","vatAmount": 0}}'
          }).then((response) => response.json())
              .then((responseJson) => {
                  NativeModules.PiaSDK.buildTransactionInfo(responseJson.transactionId ,responseJson.redirectOK);
              })
              .catch((error) => {
                console.error(error);
                 NativeModules.PiaSDK.buildTransactionInfo(null ,null);
              });
    });
  }

  paypal = () => {
    //for PayPal set only the MerchantInfo object
    NativeModules.PiaSDK.buildMerchantInfo(netsProduction.merchantIdProd, false, true);

    //set the payment result promise
    NativeModules.PiaSDK.handleSDKResult().then(()=>{
         ToastAndroid.show('SUCCESS', ToastAndroid.SHORT);
    }).catch((error) =>{
         ToastAndroid.show('CANCEL OR ERROR', ToastAndroid.SHORT);
    });
     
    NativeModules.PiaSDK.startPayPalProcess((saveCardBool) => {
        fetch(netsProduction.backendUrlProd + "v2/payment/"+ netsProduction.merchantIdProd +"/register", {
            method: 'POST',
            headers: {
              'Accept': 'application/json;charset=utf-8;version=2.0',
              'Content-Type': 'application/json;charset=utf-8;version=2.0'
            },
           body: '{"storeCard": true,"orderNumber": "PiaSDK-Android","customerId": "000003","amount": {"currencyCode": "DKK", "totalAmount": "100","vatAmount": 0}, "method": {"id":"PayPal"}}'
          }).then((response) => response.json())
              .then((responseJson) => {
                  NativeModules.PiaSDK.buildTransactionInfo(responseJson.transactionId ,responseJson.redirectOK);
              })
              .catch((error) => {
                console.error(error);
                 NativeModules.PiaSDK.buildTransactionInfo(null ,null);
              });
    });
  }

  vipps = () => {
  
    NativeModules.PiaSDK.buildMerchantInfo(netsProduction.merchantIdProd, false, false);
    NativeModules.PiaSDK.buildOrderInfo(1,"NOK");
    //set the payment result promise
    NativeModules.PiaSDK.handleSDKResult().then(()=>{
         ToastAndroid.show('SUCCESS', ToastAndroid.SHORT);
    }).catch((error) =>{
         ToastAndroid.show('CANCEL OR ERROR', ToastAndroid.SHORT);
    });
     
    NativeModules.PiaSDK.startVippsProcess((saveCardBool) => {
        fetch(netsProduction.backendUrlProd + "v2/payment/"+ netsProduction.merchantIdProd +"/register", {
            method: 'POST',
            headers: {
              'Accept': 'application/json;charset=utf-8;version=2.0',
              'Content-Type': 'application/json;charset=utf-8;version=2.0'
            },
           body: '{"amount":{"currencyCode":"NOK","totalAmount":100,"vatAmount":0},"customerId":"000013","method":{"id":"Vipps"},"orderNumber":"PiaSDK-Android","paymentMethodActionList":"[{PaymentMethod:Vipps}]","phoneNumber":"+4748059560","redirectUrl":"eu.nets.pia.sample://piasdk","storeCard":false}'
          }).then((response) => response.json())
              .then((responseJson) => {
                  NativeModules.PiaSDK.buildTransactionInfo(responseJson.transactionId ,responseJson.walletUrl);
              })
              .catch((error) => {
                console.error(error);
                 NativeModules.PiaSDK.buildTransactionInfo(null ,null);
              });
    });
  }

  swish = () => {
  
    NativeModules.PiaSDK.buildMerchantInfo(netsProduction.merchantIdProd, false, false);
    NativeModules.PiaSDK.buildOrderInfo(1,"SEK");
    //set the payment result promise
    NativeModules.PiaSDK.handleSDKResult().then(()=>{
         ToastAndroid.show('SUCCESS', ToastAndroid.SHORT);
    }).catch((error) =>{
         ToastAndroid.show('CANCEL OR ERROR', ToastAndroid.SHORT);
    });
     
    NativeModules.PiaSDK.startSwishProcess((saveCardBool) => {
        fetch(netsProduction.backendUrlProd + "v2/payment/"+ netsProduction.merchantIdProd +"/register", {
            method: 'POST',
            headers: {
              'Accept': 'application/json;charset=utf-8;version=2.0',
              'Content-Type': 'application/json;charset=utf-8;version=2.0'
            },
           body: '{"amount":{"currencyCode":"SEK","totalAmount":100,"vatAmount":0},"customerId":"000013","method":{"id":"Swish"},"orderNumber":"PiaSDK-Android","paymentMethodActionList":"[{PaymentMethod:SwishM}]","redirectUrl":"eu.nets.pia.sample://piasdk","storeCard":false}'
          }).then((response) => response.json())
              .then((responseJson) => {
                  NativeModules.PiaSDK.buildTransactionInfo(responseJson.transactionId ,responseJson.walletUrl);
              })
              .catch((error) => {
                console.error(error);
                 NativeModules.PiaSDK.buildTransactionInfo(null ,null);
              });
    });
  }

  skipConfirm = () => {
    NativeModules.PiaSDK.buildMerchantInfo(netsTest.merchantIdTest, true, true);
    NativeModules.PiaSDK.buildOrderInfo(1,"EUR");
    NativeModules.PiaSDK.buildTokenCardInfo(netsTest.tokenIdTest, netsTest.schemeIdTest, netsTest.expiryDateTest, false);
    //set the payment result promise
    NativeModules.PiaSDK.handleSDKResult().then(()=>{
         ToastAndroid.show('SUCCESS', ToastAndroid.SHORT);
    }).catch((error) =>{
         ToastAndroid.show('CANCEL OR ERROR', ToastAndroid.SHORT);
    });
   
    NativeModules.PiaSDK.startSkipConfirmation((saveCardBool) => {
        fetch(netsTest.backendUrlTest + "v2/payment/"+ netsTest.merchantIdTest +"/register", {
            method: 'POST',
            headers: {
              'Accept': 'application/json;charset=utf-8;version=2.0',
              'Content-Type': 'application/json;charset=utf-8;version=2.0'
            },
            body:'{"customerId":"000012","orderNumber":"PiaSDK-Android","amount": {"currencyCode": "EUR", "vatAmount":0, "totalAmount":"1000"},"method": {"id":"EasyPayment","displayName":"","fee":""},"cardId":"492500******0004","storeCard": true,"merchantId":"","token":"","serviceTyp":"","paymentMethodActionList":"","phoneNumber":"","currencyCode":"","redirectUrl":"","language":""}'

          }).then((response) => response.json())
              .then((responseJson) => {
                console.log('onResponse: '+responseJson)
                console.log('onResponse'+responseJson.transactionId)
                  NativeModules.PiaSDK.buildTransactionInfo(responseJson.transactionId ,responseJson.redirectOK);
              })
              .catch((error) => {
                console.error(error);
                 NativeModules.PiaSDK.buildTransactionInfo(null ,null);
              });
    });
  }

  unskipConfirm = () => {
  
    NativeModules.PiaSDK.buildMerchantInfo(netsTest.merchantIdTest, true, true);
    NativeModules.PiaSDK.buildOrderInfo(10,"EUR");
    NativeModules.PiaSDK.buildTokenCardInfo(netsTest.tokenIdTest, netsTest.schemeIdTest, netsTest.expiryDateTest, true);
    //set the payment result promise
    NativeModules.PiaSDK.handleSDKResult().then(()=>{
         ToastAndroid.show('SUCCESS', ToastAndroid.SHORT);
    }).catch((error) =>{
         ToastAndroid.show('CANCEL OR ERROR', ToastAndroid.SHORT);
    });
   
    NativeModules.PiaSDK.start((saveCardBool) => {
        fetch(netsTest.backendUrlTest + "v2/payment/"+ netsTest.merchantIdTest +"/register", {
            method: 'POST',
            headers: {
              'Accept': 'application/json;charset=utf-8;version=2.0',
              'Content-Type': 'application/json;charset=utf-8;version=2.0'
            },
            body:'{"customerId":"000012","orderNumber":"PiaSDK-Android","amount": {"currencyCode": "EUR", "vatAmount":0, "totalAmount":"1000"},"method": {"id":"EasyPayment","displayName":"","fee":""},"cardId":"492500******0004","storeCard": true,"merchantId":"","token":"","serviceTyp":"","paymentMethodActionList":"","phoneNumber":"","currencyCode":"","redirectUrl":"","language":""}'
          }).then((response) => response.json())
              .then((responseJson) => {
                console.log('onResponse: '+responseJson)
                console.log('onResponse'+responseJson.transactionId)
                  NativeModules.PiaSDK.buildTransactionInfo(responseJson.transactionId ,responseJson.redirectOK);
              })
              .catch((error) => {
                console.error(error);
                 NativeModules.PiaSDK.buildTransactionInfo(null ,null);
              });
    });
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 10,
  },
  button: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    marginTop: 5
  },
});
