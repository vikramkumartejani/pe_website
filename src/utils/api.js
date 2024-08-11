import Cookies from 'js-cookie'

function getJWT () {
    return Cookies.get('jwt')
}

function setJWT (jwt) {
    return Cookies.set('jwt', jwt)
}

export { getJWT,setJWT }