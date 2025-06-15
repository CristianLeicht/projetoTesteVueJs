<template>
  <v-form v-model="valid">
    <v-container>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="origin"
            :counter="8"
            :rules="cepRules"
            label="Origem"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="destination"
            :counter="8"
            :rules="cepRules"
            label="Destino"
            required
          ></v-text-field>
        </v-col>

        <v-row>

      <v-col 
        cols="12" 
        md="4" 
        sm="6">
          <v-btn @click="calculateDistance"
            rounded="xl"
            size="x-large"
            block>Calcular
        </v-btn>
      </v-col>

        </v-row>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field disabled=""
            v-model="distance"
            label="Distância"
            required
          ></v-text-field>
        </v-col>
    </v-container>
  </v-form>
</template>

<script>

import axios from 'axios'
import { getDistance } from 'geolib';

export default {
  name: 'HelloWorld',

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

      try {

        const [coordinatesOrigin, coordinatesDestination] = await Promise.all([

        this.getCoordinates(this.origin),
        this.getCoordinates(this.destination)

        ])

        
      const resultDistance = getDistance(coordinatesOrigin, coordinatesDestination)
              this.distance = (resultDistance / 1000).toFixed(2).replace('.', ',') + ' km'

      } catch {

        alert('Não foi possível calcular a distância.')

      }

    }
  }
}
  
</script>
