<template>
  <div>
    <page-header />
    <div class="split-container">
      <div class="split-container__item">
        <article class="text container">
          <h1>Johannische Jugend erlebt Kirchentags&shy;woche gemeinsam.</h1>
        </article>
      </div>
      <div class="split-container__item">
        <article class="text container">
          <h2>Jugendräume</h2>
          <p>
            <strong>Du bist Willkommen!</strong> Gerne kannst du auch Jugendleiter fragen, ob sie Jugendräume für Dich und Deine Freunde öffnen. Kommt vorbei 😉
          </p>
          <room-status v-for="room in rooms" :name="room.name" :is-open="room.open" />
          <small
            v-if="!rooms"
          >Die Liveanzeige der Jugendraum Öffnungen ist grade nicht verfügbar. Versuche es bitte in ca. 5 Minuten nochmal, oder wende dich an einen Jugendleiter.</small>
        </article>
      </div>
    </div>
    <div class="invader">
      Bleib auf dem Laufenden via
      <a
        href="//t.me/joinchat/D9iLlQzho6hhU-xtMB3POg"
        target="_blank"
      >Telegram</a>
    </div>
    <article class="text padding">
      <header>
        <h2>Programmauszug</h2>
      </header>Demnächst hier verfügbar.. 😉
      <Content class="text" />

      <!-- :class="index === 0 && 'bg-green'" -->
      <!-- <section v-for="(events, day, index) in eventsByDay" class="text">
        <h3>{{day | asDate}}</h3>
        <div class="teaser-container">
          <teaser-kitawo
            v-for="event in events"
            :startDate="event.startDate"
            :endDate="event.endDate"
            :name="event.name"
            :highlight="event.highlight"
            category="🙏"
            :place="event.place"
            :location="event.location"
          />
        </div>
      </section>-->
    </article>
    <!-- <div class="invader">
      Schon gesehen? 🙆 Wir haben
      <a href="//instagram.com/jjbgf.de" target="_blank">Instagram</a>
    </div>-->
    <page-footer />
  </div>
</template>
<script>
import { ByDate, EventPages, OnlyYear } from "../utils";
import { ApolloClient } from "apollo-boost";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from 'node-fetch';
import { createHttpLink } from 'apollo-link-http';

import VueApollo from "vue-apollo";

const httpLink =createHttpLink({
  fetch,
  uri: "//api.jjbg-kitawo.de"
});

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

import gql from "graphql-tag";
import moment from "moment";
moment.locale("de");

export default {
  apolloProvider,
  data() {
    return {
      rooms: []
    };
  },
  apollo: {
    // Simple query that will update the 'hello' vue property
    rooms: {
      query: gql`
        {
          rooms {
            id
            name
            open
          }
        }
      `,
      pollInterval: 10500 // ms
    }
  },
  computed: {
    data() {
      const dataAll = this.$page.frontmatter.data;
      Object.keys(dataAll).forEach(location => {
        dataAll[location] = dataAll[location]
          .map(day => {
            // only use youth related data
            day.events = day.events.filter(this.onlyYouth);

            // set location inside day
            day.events.map(event => {
              event.location = location;
            });

            return day;
          })
          .filter(day => day.events.length > 0);
      });

      return dataAll;
    },
    eventsByDay() {
      const eventsByDay = {};

      Object.keys(this.data).forEach(location => {
        this.data[location].map(day => {
          // create array if there is none
          if (!eventsByDay[day.day]) eventsByDay[day.day] = [];

          // fill array for day
          eventsByDay[day.day].push(day.events);
        });
      });

      // flatten object
      Object.keys(eventsByDay).forEach(day => {
        eventsByDay[day] = eventsByDay[day].flat();
      });

      return eventsByDay;
    }
  },
  filters: {
    asDate(date) {
      const m = moment.unix(date);
      const isSameYear = m.isSame(new Date(), "year");
      if (isSameYear) {
        return m.calendar(null, {
          sameDay: "[Heute]",
          nextDay: "[Morgen]",
          nextWeek: "DD. MMMM",
          lastDay: "DD. MMMM",
          lastWeek: "DD. MMMM",
          sameElse: "DD. MMMM"
        });
      }
      return m.format("DD. MMMM YYYY");
    }
  },
  methods: {
    onlyYouth(event) {
      return event.youth === true;
    }
  }
};
</script>


