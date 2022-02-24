<template>
     <div class="ModifyProfile">
        <LoginForm v-if="!connected"/>

        <Header v-if="connected"/>

        <UserProfile v-if="connected"/>
        <UserPosts v-if="connected"/>
        
    </div>
</template>

<script>

console.log("Bonjour");

import LoginForm from '@/components/LoginForm.vue';
import Header from '@/components/Header.vue';
import UserProfile from '@/components/UserProfile.vue';
import UserPosts from '@/components/UserPosts.vue';
export default {
    name: 'ModifyProfile',
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
   mounted(){
    this.modify()
    console.log("Bonjour");
  },
  methods: {
    modify() {
      // Récupère les infos de l'utilisateur
      this.$axios
        .get(`user/${this.$route.params.id}/modifyprofile`)
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
  }
}
</script>

<style scoped>
</style>
