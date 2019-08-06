import axios, { AxiosResponse } from 'axios'
import { Payload } from '../types/payload'
import { User } from '../types/user'
const jwtDecode = require('jwt-decode')

export async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await axios.get('http://localhost:3000/users/authstate', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    return response.status == 200 ? true : false
  } catch (err) {
    return false
  }
}

export async function getUserInformation(email: string): Promise<User> {
  try {
    const response = await axios.get(`http://localhost:3000/users/email/${email}`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      //   'Content-Type': 'application/json'
      // }
    })
    return response.data
  } catch (err) {
    return err
  }
}

export async function getPayloadFromToken(token: string): Promise<Payload> {
  return jwtDecode(token)
}

export async function isVerified(email: string): Promise<Boolean> {
  const user = await getUserInformation(email)
  return !user.verified ? false : user.verified
}
