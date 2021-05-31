import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import './assets/css/icon.css'
import {getLoginInfo} from "./api/user";

getLoginInfo().then(resp=>{
    console.log(resp);
})
const app = createApp(App)
installElementPlus(app)
app
    .use(store)
    .use(router)
    .mount('#app')
