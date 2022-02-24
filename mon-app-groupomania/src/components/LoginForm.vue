<template>
    <div class="wrapper">
        <img src="/assets/icon-left-font.png" alt="Groupomania logo">
        <nav><router-link to="/" class="active">Se connecter</router-link> | <router-link to="/signup">S'inscrire</router-link></nav>
        <form @submit.prevent = login()>

            <label for="login-email">Email :</label>
            <input id="login-email" type="text" placeholder="Email" required>
            
            <label for="login-password">Mot de passe :</label>
            <input id="login-password" type="password" placeholder="Mot de passe" required>

            <div class="error-message">{{message}}</div>

            <button id="login-btn" type="submit">Connexion</button>

            
        </form>
    </div>
    
</template>

<script>
import axios from 'axios';
export default {
    name: 'LoginForm',
    data() {
        return {
            message: "",
    
      input: {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      }
        };
    },
    methods: {
        login(){
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;
            axios.post(`${this.$apiUrl}/auth/login`,
                {
                    email,
                    password
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            .then(res => {
                localStorage.setItem('user', JSON.stringify(res.data));
                location.reload();

            })
            .catch(error => {
                if (error.error) {
                        return (this.errorMessage = error.error.errors[0].message)
                    }
                        this.message = "Erreur adresse mail / mot de passe"
                        console.log('Erreur adresse mail / mdp...')
                });
        }
    }
}
</script>

<style scoped>
    .wrapper{
        max-width: 500px;
        margin: 90px auto;
    }
    img{
        width: 100%;
    }
    nav{
        font-size: 1.05rem;
        margin: 20px;
    }
    .active{
        color: red;
        font-weight: bold;
    }
    form{
        display: flex;
        flex-direction: column;
    }
    form label{
        color: rgb(62, 77, 110);
        margin: 10px;
    }
    form input{
        font-size: 1.05rem;
        padding: 10px;
        margin-bottom: 15px;
        text-align: center;
        color: rgb(62, 77, 110);
    }
    #login-btn{
        padding: 10px;
        font-size: 1.1rem;
        color: white;
        background-color: rgb(62, 77, 110);
        border: none;
        border-radius: 10px;
        transition-duration: 0.2s;
        cursor: pointer;
    }
    #login-btn:hover{
        transform: scale(1.025);
    }
    .error-message{
        background-color: rgba(255, 0, 0, 0.301);
    }
    label{
        font-size: 0.8rem;
        font-weight: bold;
        color: rgb(62, 77, 110);
        text-align: left;
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
    }
</style>