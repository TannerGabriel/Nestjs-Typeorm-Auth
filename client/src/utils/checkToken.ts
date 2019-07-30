import axios, { AxiosResponse } from 'axios'

export async function validateToken(token: string): Promise<boolean> {
    try {
        const response = await axios.get('http://localhost:3000/users/authstate', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        return (response.status == 200) ? true : false
    } catch(err) {
        return false
    }
}