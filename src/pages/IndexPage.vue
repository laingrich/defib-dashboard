<template>
  <q-page>
    <div style="height:1030px; width:1920px">
      <l-map ref="map" :zoom="zoom" :center="mapCenter" :options="{zoomControl: false, dragging: false, boxZoom: false, scrollWheelZoom: false}">
        <l-tile-layer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=6806caf9-bd2d-4a3c-afc9-e93da7bf8a3a"
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
        <l-marker
          v-for="deployment in deployments"
          :key="deployment.id"
          :lat-lng="deployment.location"
          :zIndexOffset="1000">
            <l-icon
              icon-url="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png"
              shadowUrl="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png"
              :iconAnchor="[12, 41]">
            </l-icon>
        </l-marker>
        <l-control position="topleft" >
          <div class="row justify-start">
            <div class="q-pa-md"></div>
            <!-- Deployments -->
            <div class="q-px-xl q-pt-lg">
              <h6 class="q-my-sm">Recent Deployments</h6>
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
                    v-for="event in events"
                    :key="event.id"
                    class="list-item">
                    <q-item-section avatar>
                      <q-icon :name="getIcon(event.event).icon" :color="getIcon(event.event).iconColor" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ event.event }}</q-item-label>
                      <q-item-label caption>{{ event.date }}</q-item-label>
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
import { cabinetStream, eventStream, deploymentStream } from '../boot/firebase'

export default defineComponent({
  name: 'IndexPage',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LControl,
    LIcon
  },

  computed: {
    iconData () {
      return this.events.map(event => {
        return this.iconGetter(event.event)
      })
    }
  },

  data () {
    return {
      zoom: 10,
      mapCenter: latLng(50.3, -5.2),
      deployments: [],
      events: [],
      displayedEvents: [],
      cabinets: [],
      iconGroups: [
        {
          event: 'Door Closed',
          icon: 'door_front',
          iconColor: 'green'
        },
        {
          event: 'Door Open',
          icon: 'door_front',
          iconColor: 'blue'
        },
        {
          event: 'Interior Light Off',
          icon: 'light',
          iconColor: 'green'
        },
        {
          event: 'Interior Light On',
          icon: 'light',
          iconColor: 'blue'
        },
        {
          event: 'Heater On',
          icon: 'ac_unit',
          iconColor: 'blue'
        },
        {
          event: 'Heater Off',
          icon: 'ac_unit',
          iconColor: 'green'
        },
        {
          event: 'Temperature Acceptable',
          icon: 'thermostat',
          iconColor: 'green'
        },
        {
          event: 'Temperature Alert - too cold',
          icon: 'thermostat',
          iconColor: 'blue'
        },
        {
          event: 'Check Complete',
          icon: 'sentiment_satisfied',
          iconColor: 'green'
        },
        {
          event: 'Started Monitor',
          icon: 'done',
          iconColor: 'green'
        },
        {
          event: 'Connection Established',
          icon: 'wifi',
          iconColor: 'green'
        },
        {
          event: 'Lost Connection',
          icon: 'wifi',
          iconColor: 'blue'
        },
        {
          event: 'Defib Present',
          icon: 'favorite',
          iconColor: 'green'
        },
        {
          event: 'Defib Removed',
          icon: 'favorite',
          iconColor: 'blue'
        }
      ]
    }
  },
  mounted () {
    cabinetStream(snapshot => {
      this.cabinets = snapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      })
    })
    eventStream(snapshot => {
      this.events = snapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      })
    })
    deploymentStream(snapshot => {
      this.deployments = snapshot.docs.map(doc => {
        const cabinet = this.cabinets.find(cabinet => cabinet.id === doc.ref.parent.parent.id)
        return {
          id: doc.id,
          ...doc.data(),
          name: cabinet.title,
          area: cabinet.area,
          location: cabinet.location,
          color: cabinet.status !== 'On Standby' ? 'blue' : 'green'
        }
      })
    })
  },
  methods: {
    getIcon (event) {
      const { icon = 'favorite_border', iconColor = 'blue' } = this.iconGroups.find(group => group.event === event) || {}
      return { icon, iconColor }
    }
  }
})
</script>
