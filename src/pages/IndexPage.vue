<template>
  <q-page>
    <div style="height:1030px; width:1920px">
      <l-map ref="map" :zoom="zoom" :center="mapCenter" :options="{zoomControl: false, dragging: false, boxZoom: false, scrollWheelZoom: false}">
        <l-tile-layer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          layer-type="base"
          name="OpenStreetMap"
        ></l-tile-layer>
        <l-marker
          v-for="cabinet in cabinets"
          :key="cabinet.id"
          :lat-lng="cabinet.location">
            <l-icon
              icon-url="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png"
              shadowUrl="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png"
              :iconAnchor="[12, 41]">
            </l-icon>
        </l-marker>
        <l-control position="topleft" >
          <div class="row justify-start">
            <div class="q-pa-md"></div>
            <!-- Deployments -->
            <div class="q-px-xl q-pt-lg">
              <h6 class="q-my-sm">Latest Deployments</h6>
              <q-timeline class="text q-mx-lg q-pt-lg">
                <q-timeline-entry
                  v-for="deployment in deployments"
                  :key="deployment.id"
                  :color="deployment.color"
                  :title="deployment.area + ' - ' + deployment.name"
                  :subtitle="deployment.date"
                >
                  <div>
                    {{ deployment.status }}
                  </div>
                </q-timeline-entry>
              </q-timeline>
            </div>
            <!-- Events -->
            <div id="events" class="q-pt-lg q-pb-xl q-px-xl" style="width: 350px">
              <h6 class="q-my-sm">Latest Events</h6>
              <q-list class="text">
                <transition-group name="list" tag="div">
                  <q-item
                    v-for="event in displayedEvents"
                    :key="event.id"
                    class="list-item"
                  >
                    <q-item-section avatar>
                      <q-icon :color="event.iconColor" :name="event.icon" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ event.msg }}</q-item-label>
                      <q-item-label caption>{{ event.timestamp }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </transition-group>
              </q-list>
            </div>
            <!-- Totals-->
            <div class="q-pt-xl q-px-xl" style="max-width: 350px">
              <q-list>
                <q-item
                  class="q-chip row inline no-wrap items-center text-green q-chip--colored q-chip--outline q-chip--clickable cursor-pointer non-selectable q-hoverable q-chip--square"
                  tabindex="0"
                  style="font-size: 24px"
                >
                  <div
                    class="q-chip__content col row no-wrap items-center q-anchor--skip"
                  >
                    <div class="q-avatar bg-green text-white" style="width: 1.5em">
                      <div class="q-avatar__content row flex-center overflow-hidden">
                        {{ cabinets.length }}
                      </div>
                    </div>
                    <div
                      class="q-item__section column q-item__section--main justify-center q-py-md"
                    ></div>
                    <div class="text-subtitle2">Total Defibs</div>
                  </div>
                </q-item>
              </q-list>
            </div>
          </div>
        </l-control>
      </l-map>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker, LControl, LIcon } from '@vue-leaflet/vue-leaflet'
import { latLng } from 'leaflet'
// delete this line
import { cabinetStream, deploymentStream } from '../boot/firebase'
// and uncomment this to enable events
// import { cabinetStream, eventStream, deploymentStream } from '../boot/firebase'

export default defineComponent({
  name: 'IndexPage',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LControl,
    LIcon
  },

  data () {
    return {
      zoom: 9,
      mapCenter: latLng(50.6, -5),
      deployments: [],
      events: [
        {
          id: 1,
          icon: 'ac_unit',
          msg: 'Heater on',
          iconColor: 'blue',
          timestamp: '12/7/2021 12:00'
        },
        {
          id: 2,
          icon: 'ac_unit',
          msg: 'Heater off',
          iconColor: 'primary',
          timestamp: '12/7/2021 12:00'
        },
        {
          id: 3,
          icon: 'thermostat',
          msg: 'Temperature Acceptable',
          iconColor: 'primary',
          timestamp: '12/7/2021 12:00'
        },
        {
          id: 4,
          icon: 'light',
          msg: 'Light on',
          iconColor: 'blue',
          timestamp: '12/7/2021 12:00'
        },
        {
          id: 5,
          icon: 'light',
          msg: 'Light off',
          iconColor: 'primary',
          timestamp: '12/7/2021 12:00'
        },
        {
          id: 6,
          icon: 'thermostat',
          msg: 'Temperature low',
          iconColor: 'blue',
          timestamp: '12/7/2021 12:00'
        },
        {
          id: 7,
          icon: 'thermostat',
          msg: 'Temperature high',
          iconColor: 'blue',
          timestamp: '12/7/2021 12:00'
        }],
      displayedEvents: [],
      cabinets: []
    }
  },
  mounted () {
    cabinetStream(snapshot => {
      console.log(snapshot)
      this.cabinets = snapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      })
    })
    this.updateList()
    // eventStream(snapshot => {
    //   console.log(snapshot)
    //   this.events = snapshot.docs.map(doc => {
    //     return {
    //       id: doc.id,
    //       ...doc.data()
    //     }
    //   })
    // })
    deploymentStream(snapshot => {
      console.log(snapshot)
      this.deployments = snapshot.docs.map(doc => {
        const cabinet = this.cabinets.find(cabinet => cabinet.id === doc.ref.parent.parent.id)
        return {
          id: doc.id,
          ...doc.data(),
          name: cabinet.title,
          area: cabinet.area,
          color: cabinet.status !== 'On Standby' ? 'blue' : 'green'
        }
      })
    })
  },
  methods: {
    updateList () {
      let currentIndex = 0
      setInterval(() => {
        this.displayedEvents = [
          this.events[(currentIndex + 5) % this.events.length],
          this.events[(currentIndex + 4) % this.events.length],
          this.events[(currentIndex + 3) % this.events.length],
          this.events[(currentIndex + 2) % this.events.length],
          this.events[(currentIndex + 1) % this.events.length],
          this.events[currentIndex]
        ]
        currentIndex = (currentIndex + 1) % this.events.length
      }, 3000)
    }
  }
})
</script>
