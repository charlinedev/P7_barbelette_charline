<template>
     <div class="Profile">
        <LoginForm v-if="!connected"/>

        <Header v-if="connected"/>

        <UserProfile v-if="connected"/>
        <UserPosts v-if="connected"/>
        
    </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue';
import Header from '@/components/Header.vue';
import UserProfile from '@/components/UserProfile.vue';
import UserPosts from '@/components/UserPosts.vue';
export default {
    name: 'Profile',
    components: {
        LoginForm,
        Header,
        UserProfile,
        UserPosts
  },
  data() {
    return{
          user:"",
          email:"",
    };
  },
   created(){
    this.checkConnected()
  },
  methods: {
    profile() {
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
    checkConnected(){
      if(localStorage.users !== undefined){
        this.connected = true;
        console.log('Utilisateur connecté !');
      }
      else if(localStorage.users == undefined){
        this.connected = false;
        console.log('Utilisateur non connecté !');
      }
    },
  }
}
</script>

<style scoped>
</style>
