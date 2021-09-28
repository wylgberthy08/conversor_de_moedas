import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';

import Picker from './src/components/Picker';
import api from './src/services/api';

export default function App() {

  const [moedas, setMoedas] = useState([]);
  const [loading, SetLoading] = useState(true);

  const [moedaSelecionada, setMoedaSelecionada] = useState(null);
  const [moedaBValor, setMoedaBValor] = useState(0);

  const [valorMoeda, setValorMoeda] = useState(null);
  const [valorConvertido, setValorConvertido] = useState(0)

  useEffect(() => {
    async function loadMoedas() {
      const response = await api.get('all');

      let arrayMoedas = []
      Object.keys(response.data).map((key) => {
        arrayMoedas.push({
          key: key,
          label: key,
          value: key
        })
      })
      setMoedas(arrayMoedas);
      SetLoading(false)
    }

    loadMoedas();
  }, [])

  async function converter() {
    if (moedaSelecionada === null || moedaBValor === 0) {
      alert('Por favor selecione um valor!');
      return;
    }

    const response = await api.get(`all/${moedaSelecionada}-BRL`);
    //console.log(response.data[moedaSelecionada].ask)

    let resultado = (response.data[moedaSelecionada].ask * parseFloat(moedaBValor));
    setValorConvertido(`R$ ${resultado.toFixed(2)}`);
    setValorMoeda(moedaBValor)

    Keyboard.dismiss();
  }

  if (loading) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <ActivityIndicator color="#000" size={45} />
      </View>
    )

  } else {
    return (
      <View style={styles.container}>

        <View style={styles.areaMoeda}>
          <Text style={styles.titulo}>Selecione sua moeda</Text>

          <Picker moedas={moedas} onChange={(moeda) => setMoedaSelecionada(moeda)} />

        </View>

        <View style={styles.areaValor}>
          <Text>Digite um valor para converter em (R$)</Text>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            placeholder="EX: 150"
            onChangeText={(valor) => setMoedaBValor(valor)}
          />
        </View>

        <TouchableOpacity style={styles.areaBotao} onPress={converter}>
          <Text style={styles.botaoTexto}>Converter</Text>
        </TouchableOpacity>

        {valorConvertido != 0 && (
          <View style={styles.areaResultado}>
            <Text style={styles.valorConvertido}>{valorMoeda} {moedaSelecionada}</Text>
            <Text style={[styles.valorConvertido, { fontSize: 18, margin: 10, }]}>Corresponde a</Text>
            <Text style={[styles.valorConvertido,{color:'#31ad52' }]}>{valorConvertido}</Text>
          </View>
        )}


      </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101215',
    alignItems: 'center',
    paddingTop: 40
  },

  areaMoeda: {
    width: '90%',
    backgroundColor: '#f9f9f9',
    paddingTop: 9,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    marginBottom: 1
  },
  titulo: {
    fontSize: 15,
    color: '#000',
    paddingTop: 5,
    paddingLeft: 5
  },
  areaValor: {
    width: '90%',
    backgroundColor: '#f9f9f9',
    paddingBottom: 9,
    paddingTop: 9
  },
  input: {
    width: '100%',
    padding: 10,
    height: 45,
    fontSize: 20,
    marginTop: 8,
    color: "#000"
  },
  areaBotao: {
    width: '90%',
    backgroundColor: '#fb4b57',
    height: 45,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
    alignItems: 'center',
    justifyContent: 'center'
  },

  botaoTexto: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold'
  },

  areaResultado: {
    width: '90%',
    backgroundColor: '#f9f9f9',
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    borderRadius:10
  },

  valorConvertido: {
    fontSize: 39,
    fontWeight: 'bold',
    color: '#000'
  }
});
