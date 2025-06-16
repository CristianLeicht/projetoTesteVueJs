<template>
  <v-form v-model="valid" style="background-color: #f0f0f0; background-size: cover; background-position: center; height: 100vh;">
    <v-container>
      <v-row justify="center">
        <v-col
          cols="1">

          <v-img 
            src="@/assets/compass.png"
            alt="Compass"
            max-width="150" 
          ></v-img>
        </v-col>

      </v-row>

      <v-row justify="center">
          <v-col
            cols="3">

            <h1 style="text-align: center;">
              Calculadora de distância
            </h1>
          </v-col>
      </v-row>

      <v-row justify="center">

        <v-col
          cols="12"
          md="6">

          <p class="text-body-2" style="text-align: center;">
            <strong>Bem vindo!</strong> Aqui você pode calcular a <strong>distância entre dois locais</strong> com base em dois <strong>CEP's.</strong> 
            <br>
            Basta inserir os <strong>CEP's</strong> de origem e destino, e clicar no botão <strong>Calcular</strong>, obtendo a distância em <strong>quilômetros.</strong>
          </p>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="origin"
            style="font-weight: bold;"
            variant="outlined"
            :rules="cepRules"
            label="CEP origem"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="destination"
            style="font-weight: bold;"
            variant="outlined"
            :rules="cepRules"
            label="CEP destino"
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col 
          cols="12" 
          sm="6" 
          md="1" 
        >
          <v-btn 
            color="indigo-darken-3"
            @click="calculateDistance"
            rounded="xl"
            size="large"
            :disabled="!origin || !destination"
            block
          >
            Calcular
          </v-btn>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col
          cols="12"
          md="2"
        >
          <v-text-field
            variant="plain"
            class="text-center"
            style="font-weight: bold;"
            readonly
            v-model="distance"
            required
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>

import axios from 'axios'
import { getDistance } from 'geolib';

export default {
  name: 'DistanceCalculator',

  data: () => ({
      valid: false,
      origin: '',
      destination: '',
      cepRules: [
        value => {
          if (value) return true

          return 'Insira o CEP'
        },
        value => {
          const onlyNumbers = /^[0-9]+$/;
          if (onlyNumbers.test(value)) return true

          return 'O CEP deve conter apenas números'
        },
      ],
      distance: ''
    }),

    methods: {

    async getCoordinates(cep) {

      try{

        const coordinates = await axios.get(`https://brasilapi.com.br/api/cep/v2/${cep}`, {

        })

        return this.coordinates = coordinates.data.location.coordinates

      }catch{

         alert('Não foi possível encontrar as coordenadas do CEP: '+ cep + '. Por favor tente novamente')

      }

    },

    async calculateDistance() {

      if (!this.validacoes()) {

        alert('Verifique as informações digitadas.')
        return;

      }

      try {

        const [coordinatesOrigin, coordinatesDestination] = await Promise.all([

        this.getCoordinates(this.origin),
        this.getCoordinates(this.destination)

        ])

        
        const resultDistance = getDistance(coordinatesOrigin, coordinatesDestination)
        this.distance = 'Distância: '+(resultDistance / 1000).toFixed(2).replace('.', ',') + ' km'

      } catch {

        alert('Não foi possível calcular a distância.')

      }
    },

    validacoes() {

      const onlyNumbers = /^[0-9]+$/;

      if ((!this.origin || !onlyNumbers.test(this.origin)) || (!this.destination || !onlyNumbers.test(this.destination))) {

        return false;
      }

        return true;
    }
  }
}
  
</script>
