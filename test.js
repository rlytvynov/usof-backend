let login = 'rlytvynov'
let password = 'mamalora'

const newUser = {login, password}
console.log(typeof newUser)

for (const item in newUser) {
    console.log(newUser[item])
}
