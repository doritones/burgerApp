import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://react-my-burger-dpa.firebaseio.com/'
})

export default instance;
