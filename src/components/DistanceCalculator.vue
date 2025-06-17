<template>
  <v-form v-model="valid" style="background-color: #d2d2d2; background-size: cover; background-position: center; height: 100vh;">
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
            clearable
            maxlength="9"
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
            clearable
            maxlength="9"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col 
          cols="auto"
        >
          <v-btn 
            color="indigo-darken-3"
            @click="calculateDistance"
            rounded="xl"
            size="large"
            :disabled="!validacoes()"
            style="min-width: 150px;"
          >
            Calcular
          </v-btn>
        </v-col>
      </v-row>

        <v-row v-if="distance"
            justify="center"
            :align="center">
            <v-col
              cols="12"
              md="12"
              class="d-flex align-center justify-center">
                <span
                  style="font-weight: bold;
                  font-size: 32px">
                  Distância: {{ distance }}
                </span> 
            </v-col>
      </v-row>
    </v-container>

  <v-dialog
    v-model="dialog"
    max-width="400">
    <v-card>
        <v-card-title
          class="headline">
          Aviso
        </v-card-title>

        <v-card-text>
          {{ dialogMessage }}
        </v-card-text>

        <v-card-actions>
          <v-spacer>
          </v-spacer>
          <v-btn
              variant="tonal"
              color="indigo-darken-3"
              text @click="dialog = false">
            OK
          </v-btn>
        </v-card-actions>
    </v-card>
  </v-dialog>

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
      distance: '',
      dialog: false,
      dialogMessage: ''
    }),

    methods: {

    async getCoordinates(cep) {

      try{

        const coordinates = await axios.get(`https://brasilapi.com.br/api/cep/v2/${cep}`, {

        })

        return this.coordinates = coordinates.data.location.coordinates

      }catch (error) {        
        this.dialogMessage = 'Não foi possível encontrar as coordenadas do CEP: '+ cep + '. Por favor tente novamente'
        this.dialog = true;
        throw error;
      }

    },

    async calculateDistance() {

      if (!this.validacoes()) {

        this.dialogMessage = 'Verifique as informações digitadas.'
        this.dialog = true
        return;

      }

      
      try {
        const coordinatesOrigin = await this.getCoordinates(this.origin);
        const coordinatesDestination = await this.getCoordinates(this.destination);

        
        const resultDistance = getDistance(coordinatesOrigin, coordinatesDestination)
        this.distance = (resultDistance / 1000).toFixed(2).replace('.', ',') + ' km'

      } catch {

        this.dialog = true

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
