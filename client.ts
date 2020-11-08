import * as WebSocket from 'ws'
import * as inquirer from 'inquirer'

const client = new WebSocket('ws://localhost:3000')

async function sendMessageLoop() {
  const {message} = await inquirer.prompt([{type: 'input', name: 'message', message: 'Message:'}])
  client.send(message)
  await sendMessageLoop()
}

client.onopen = () => {
  sendMessageLoop()
}

client.onmessage = (event) => {
  console.log('received message', event)
}
