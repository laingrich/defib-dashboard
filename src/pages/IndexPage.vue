<template lang="pug">
q-page
  div(style="height:calc(100vh - 50px); width:100vw")
    l-map(
      ref="map"
      :zoom="zoom"
      :center="mapCenter"
      :options="{zoomControl: false, dragging: false, boxZoom: false, scrollWheelZoom: true}"
    )
      l-tile-layer(
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=6806caf9-bd2d-4a3c-afc9-e93da7bf8a3a"
        layer-type="base"
        name="OpenStreetMap"
        attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a>'
      )
      l-marker(
        v-for="cabinet in cabinets"
        :key="cabinet.id + cabinet.lastreport"
        :lat-lng="cabinet.location"
      )
        l-icon(
          :icon-url="greenDotIcon"
          :icon-size="[10, 10]"
          :icon-anchor="[5, 5]"
          :class-name="icon"
          )
      l-marker(
        v-for="cabinet in cabinets"
        :key="cabinet.id + cabinet.lastreport"
        :lat-lng="cabinet.location"
      )
        l-icon(
          :icon-url="greenDotIcon"
          :icon-size="[100, 100]"
          :icon-anchor="[50, 50]"
          :class-name="ping"
          )
      l-marker(
        v-for="cabinet in cabinets"
        :key="cabinet.id + cabinet.lastreport"
        :lat-lng="cabinet.location"
      )
        l-icon(
          :icon-url="greenDotIcon"
          :icon-size="[100, 100]"
          :icon-anchor="[50, 50]"
          :class-name="ping2"
          )
      l-control(position="topleft")
        div.row.justify-start
          div(class="q-px-xl q-pt-lg q-ml-md")
            .text-h6.q-my-sm Recent Deployments
            q-timeline.text.q-mx-lg.q-pt-lg
              q-timeline-entry(
                v-for="deployment in deployments"
                :key="deployment.id"
                :color="deployment.color"
                :title="deployment.area + ' - ' + deployment.name"
                :subtitle="deployment.date"
              )
                  div {{ deployment.status }}
          div(
            id="events"
            class="q-pt-lg q-pb-xl q-px-xl"
            style="width: 350px")
            .text-h6.q-my-sm Latest Events
            q-list.text
              transition-group(name="list" tag="div")
                q-item.list-item(
                  v-for="event in events"
                  :key="event.id"
                )
                  q-item-section(avatar)
                    q-icon(:name="getIcon(event.event).icon" :color="getIcon(event.event).iconColor")
                  q-item-section
                    q-item-label {{ event.event }}
                    q-item-label(caption) {{ event.date }}
          div(class="q-pt-xl q-px-xl" style="max-width: 350px")
            q-list
              q-item(
                class="q-chip row inline no-wrap items-center text-green q-chip--colored q-chip--outline q-chip--clickable cursor-pointer non-selectable q-hoverable q-chip--square"
                tabindex="0"
                style="font-size: 24px"
              )
                div(class="q-chip__content col row no-wrap items-center q-anchor--skip")
                  div(class="q-avatar bg-green text-white" style="width: 1.5em")
                    div(class="q-avatar__content row flex-center overflow-hidden") {{ cabinets.length }}
                  div(
                    class="q-item__section column q-item__section--main justify-center q-py-md"
                  )
                    div(class="text-subtitle2") Total Defibs
          l-control(position="bottomright")
            img(src="../assets/tango3-innovation-for-hire.png" style="width: 200px; height: 200px")
</template>

<script>
import { defineComponent } from 'vue'
import 'leaflet/dist/leaflet.css'
import {
  LMap,
  LTileLayer,
  LMarker,
  LControl,
  LIcon,
  LCircle
} from '@vue-leaflet/vue-leaflet'
import { latLng } from 'leaflet'
import { cabinetStream, eventStream, deploymentStream } from '../boot/firebase'

export default defineComponent({
  name: 'IndexPage',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LControl,
    LIcon,
    LCircle
  },

  computed: {
    iconData () {
      return this.events.map((event) => {
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
      greenDotIcon: 'icons/greenDotIcon.png',
      blueDotIcon: 'icons/blueDotIcon.png',
      ping: 'ping',
      ping2: 'ping2',
      icon: 'icon',
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
      const changes = snapshot.docChanges()

      changes.forEach(change => {
        const docData = {
          id: change.doc.id,
          ...change.doc.data()
        }

        if (change.type === 'added') {
          this.cabinets.push(docData)
        }
        if (change.type === 'modified') {
          const index = this.cabinets.findIndex(cabinet => cabinet.id === change.doc.id)
          //
          if (index !== -1) { // if the cabinet exists (previous code wil return -1 if no elements are found))
            this.cabinets[index] = docData
          }
        }
        if (change.type === 'removed') {
          this.cabinets = this.cabinets.filter(cabinet => cabinet.id !== change.doc.id)
        }
      })
    })

    eventStream((snapshot) => {
      this.events = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        }
      })
    })
    deploymentStream((snapshot) => {
      this.deployments = snapshot.docs.map((doc) => {
        const cabinet = this.cabinets.find(
          (cabinet) => cabinet.id === doc.ref.parent.parent.id
        )
        return {
          id: doc.id,
          ...doc.data(),
          name: cabinet?.title ?? '',
          area: cabinet?.area ?? '',
          location: cabinet?.location ?? '',
          color: cabinet?.status === 'In Use' ? 'blue' : 'green'
        }
      })
    })
  },

  methods: {
    getIcon (event) {
      const { icon = 'favorite_border', iconColor = 'blue' } =
        this.iconGroups.find((group) => group.event === event) || {}
      return { icon, iconColor }
    }
  }
})
</script>
