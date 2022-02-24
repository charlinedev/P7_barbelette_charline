<template>
   <div class="container-fluid">
   <!-- Alert si l'user est non connecté -->
    <Alert v-if="!connected" :alertType="alert.type" :alertMessage="alert.message" />
    <!-- Fin -->
    <div v-else>     
     <Header />
     <UserProfile />
     <UserPosts />
     <section class="border-bottom" v-if="user.yourProfile === 1">
       <h2
          class="h6"
          data-toggle="collapse"
          href="#collapseUpdateProfile"
          role="button"
          aria-expanded="false"
          aria-controls="collapseUpdateProfile"
        >Modifier votre profil</h2>
        <form class="collapse" id="collapseUpdateProfile">
          <div class="custom-file mb-3">
            <input
              name="image"
              type="file"
              class="custom-file-input"
              accept="image/*"
              v-on:change="updateAvatar($event)"
            />
            <label class="custom-file-label" for="image">Choisir un avatar</label>
          </div>
        </form>  
    </section>
    </div>
   </div>
</template>

<script>

import Header from "@/components/Header.vue";
import UserProfile from "@/components/UserProfile.vue";
import UserPosts from "@/components/UserPosts.vue";
import Alert from "@/components/Alert.vue";

export default {
    name: 'Profile',
    components: {
      Header,
      UserProfile,
      UserPosts,
      Alert,
    },
  data:() => {
    return {
      connected: true,
      alert: {
        type: "",
        message: "",
      },
      user: {},
    };
  },
  computed: {
    fullName() {
      // Retourne le nom complet
      return `${this.user.prenom} ${this.user.nom}`;
    },
  },

  methods: {
    alertConstant(type, message) {
      // Crée une alerte
      const dataAlert = this.$data.alert;
      this.connected = false;
      dataAlert.type = type;
      dataAlert.message = message;
    },
    getUser() {
      // Récupère les infos de l'utilisateur
      this.$axios
        .get(`user/${this.$route.params.id}/profile`)
        .then((data) => {
          this.user = data.data[0];
        })
        .catch((e) => {
          if (e.response.status === 401) {
            this.alertConstant("alert-danger mt-5", "Veuillez vous connecter");
          }
          if (e.response.status === 400) {
            this.alertConstant("alert-warning mt-5", "Utilisateur non trouvé");
          }
          if (e.response.status === 500) {
            this.alertConstant("alert-warning mt-5", "Erreur serveur");
          }
        });
    },

  },
}
</script>

<style scoped>
.avatar {
  width: 10em;
  height: 10em;
  object-fit: cover;
}
</style>
