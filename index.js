const axios = require('./axios')

function login() {
  const formLogin = { password: '', username: '' }
  return axios
    .post('v1/session', formLogin)
    .then(({ data }) => {
      return data
    })
    .catch((error) => {
      console.log(error.response.data.errors)
    })
}
async function main() {
  const dataLogin = await login()
  console.log(dataLogin)

  const infoServer = await info(dataLogin)

  const myArgs = process.argv.slice(2)
  switch (myArgs[0]) {
    case 'start':
      await start(dataLogin, infoServer.servers[0].uuid)
      break
    case 'off':
      await off(dataLogin, infoServer.servers[0].uuid)
      break
  }
}

async function start(dataLogin, uuid) {
  await axios
    .post(
      `v2/server/${uuid}/start`,
      {},
      {
        headers: {
          'x-auth-token': dataLogin.auth_token,
        },
      }
    )
    .then(({ data }) => {
      return data
    })
    .catch((error) => {
      console.log('start', error.response.data.errors)
    })
}

async function off(dataLogin, uuid) {
  const reqOff = {
    stop_server: {
      reason: 'Planned maintenance',
      stop_type: 'soft',
      timeout: 60,
    },
  }
  await axios
    .post(`v1/server/${uuid}/stop`, reqOff, {
      headers: {
        'x-auth-token': dataLogin.auth_token,
      },
    })
    .then(({ data }) => {
      console.log(data)
      return data
    })
    .catch((error) => {
      console.log(error.response.data.errors)
    })
}

async function info(dataLogin) {
  return await axios
    .get('v2/server', {
      headers: {
        'x-auth-token': dataLogin.auth_token,
      },
    })
    .then(({ data }) => {
      return data
    })
    .catch((error) => {
      console.log(error.response.data.errors)
    })
}

main()
